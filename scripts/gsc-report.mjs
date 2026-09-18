#!/usr/bin/env node
/**
 * Forest Spa — Google Search Console report.
 *
 * Answers the question GA4 can't: what is Google actually *showing* this site
 * for, how many impressions that earns, and which queries the Wix → Astro
 * migration cost us. The migration (2026-07-22) turned 42 previously indexed
 * URLs into noindex redirect stubs, leaving exactly one indexable page, so the
 * interesting signal is per-query impression loss and service-term coverage.
 *
 * Setup: same service account as ga4-report.mjs, plus two extra steps —
 *   1. Google Cloud console → enable the "Google Search Console API".
 *   2. Search Console → Settings → Users and permissions → add the service
 *      account's email as a **Full** or **Restricted** user.
 *   3. .env needs GOOGLE_APPLICATION_CREDENTIALS (shared with the GA4 script).
 *      Optionally set GSC_SITE_URL — defaults to the https://www. prefix form;
 *      use `sc-domain:forestspamassage.com` if the property is domain-scoped.
 *
 * Usage:
 *   node scripts/gsc-report.mjs                  # last 28 days vs previous 28
 *   node scripts/gsc-report.mjs --days 7
 *   node scripts/gsc-report.mjs --since-migration # 2026-07-22 → now vs before
 *   node scripts/gsc-report.mjs --queries 40      # show more query rows
 *   node scripts/gsc-report.mjs --json
 */

import './lib/proxy.mjs';
import { config, getAccessToken, SCOPES, num, delta, bar, table, windows } from './lib/google-auth.mjs';

const DEFAULT_SITE = 'https://www.forestspamassage.com/';
const MIGRATION_DATE = '2026-07-22';

/**
 * Service terms this spa actually sells, each with the substrings that identify
 * it in a search query. Used to measure how much of the menu Google surfaces —
 * the direct evidence for whether dedicated service pages are worth building.
 */
const SERVICE_TERMS = [
  ['Head spa', ['head spa', 'scalp', 'japanese head']],
  ['Deep tissue', ['deep tissue']],
  ['Swedish', ['swedish']],
  ['Thai', ['thai']],
  ['Couples', ['couple', 'couples']],
  ['Prenatal', ['prenatal', 'pregnan']],
  ['TMJ / jaw', ['tmj', 'jaw']],
  ['Four hands', ['four hand', '4 hand']],
  ['Sports', ['sports massage']],
  ['Foot / reflexology', ['foot', 'reflexolog']],
  ['Lymphatic', ['lymphatic']],
  ['Lomi Lomi', ['lomi']],
  ['Cupping', ['cupping']],
  ['Hot stone', ['hot stone']],
  ['Packages / combo', ['package', 'combo', 'special', 'deal']],
  ['Membership', ['membership', 'monthly plan']],
  ['Gift card', ['gift card', 'gift certificate']],
];

/* -------------------------------------------------------------------------- */
/*  Args                                                                      */
/* -------------------------------------------------------------------------- */

function parseArgs(argv) {
  const args = { days: 28, queries: 20, json: false, sinceMigration: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--days') args.days = Number(argv[++i]);
    else if (a === '--queries') args.queries = Number(argv[++i]);
    else if (a === '--since-migration') args.sinceMigration = true;
    else if (a === '--json') args.json = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  if (!Number.isInteger(args.days) || args.days < 1 || args.days > 480) {
    throw new Error(`--days must be an integer between 1 and 480 (got ${args.days})`);
  }
  return args;
}

const HELP = `
Forest Spa Search Console report

  node scripts/gsc-report.mjs [--days N] [--since-migration] [--queries N] [--json]

  --days N            window size; compares last N days against the N before (default 28)
  --since-migration   compare ${MIGRATION_DATE}→today against the equal span before it
  --queries N         how many query rows to print (default 20)
  --json              emit raw JSON instead of the formatted report

Requires GOOGLE_APPLICATION_CREDENTIALS; optionally GSC_SITE_URL.
`;

/* -------------------------------------------------------------------------- */
/*  API                                                                       */
/* -------------------------------------------------------------------------- */

/** Query the Search Analytics API. Returns `{ rows }` or `{ error }`. */
async function query(siteUrl, token, body) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ dataState: 'all', ...body }),
    },
  );
  const json = await res.json();
  if (!res.ok) return { error: json.error?.message ?? `HTTP ${res.status}` };
  return { rows: json.rows ?? [] };
}

const sum = (rows, key) => rows.reduce((t, r) => t + (r[key] ?? 0), 0);

/** Impression-weighted average position — a plain mean over-weights rare queries. */
function avgPosition(rows) {
  const imp = sum(rows, 'impressions');
  if (!imp) return 0;
  return rows.reduce((t, r) => t + r.position * r.impressions, 0) / imp;
}

/* -------------------------------------------------------------------------- */
/*  Report                                                                    */
/* -------------------------------------------------------------------------- */

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    return;
  }

  const env = config();
  const keyFile = env.GOOGLE_APPLICATION_CREDENTIALS;
  const siteUrl = env.GSC_SITE_URL || DEFAULT_SITE;

  if (!keyFile) {
    console.error(
      'Missing credentials.\n' +
        '  GOOGLE_APPLICATION_CREDENTIALS ✗ missing — path to service-account JSON key\n' +
        '\nAlso make sure the service account is added as a user in Search Console\n' +
        '(Settings → Users and permissions) and that the Search Console API is enabled.\n' +
        '\nSee the setup steps at the top of scripts/gsc-report.mjs.',
    );
    process.exitCode = 1;
    return;
  }

  // Search Console data lags ~2 days; window off that rather than off today.
  let current;
  let previous;
  if (args.sinceMigration) {
    const end = new Date();
    end.setUTCDate(end.getUTCDate() - 2);
    const start = new Date(`${MIGRATION_DATE}T00:00:00Z`);
    const span = Math.round((end - start) / 86400000);
    const prevEnd = new Date(start);
    prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setUTCDate(prevStart.getUTCDate() - span);
    const iso = (d) => d.toISOString().slice(0, 10);
    current = { startDate: MIGRATION_DATE, endDate: iso(end) };
    previous = { startDate: iso(prevStart), endDate: iso(prevEnd) };
  } else {
    ({ current, previous } = windows(args.days, 2));
  }

  const token = await getAccessToken(keyFile, SCOPES.searchConsole);
  const range = (r) => ({ startDate: r.startDate, endDate: r.endDate });

  const [curTotal, prevTotal, curQ, prevQ, daily, pages, devices, countries] = await Promise.all([
    // No dimensions → one true total row. Summing query rows undercounts,
    // because Search Console withholds long-tail queries below a privacy
    // threshold; those impressions exist but never appear as rows.
    query(siteUrl, token, { ...range(current) }),
    query(siteUrl, token, { ...range(previous) }),
    query(siteUrl, token, { ...range(current), dimensions: ['query'], rowLimit: 5000 }),
    query(siteUrl, token, { ...range(previous), dimensions: ['query'], rowLimit: 5000 }),
    query(siteUrl, token, { ...range(current), dimensions: ['date'], rowLimit: 500 }),
    query(siteUrl, token, { ...range(current), dimensions: ['page'], rowLimit: 200 }),
    query(siteUrl, token, { ...range(current), dimensions: ['device'], rowLimit: 10 }),
    query(siteUrl, token, { ...range(current), dimensions: ['country'], rowLimit: 10 }),
  ]);

  if (curQ.error) {
    throw new Error(
      `Search Console rejected the request: ${curQ.error}\n` +
        `  site: ${siteUrl}\n` +
        `  If this says the site isn't found, the property URL is wrong — try\n` +
        `  GSC_SITE_URL=sc-domain:forestspamassage.com in .env instead.`,
    );
  }

  if (args.json) {
    console.log(JSON.stringify({ current, previous, curQ, prevQ, daily, pages, devices, countries }, null, 2));
    return;
  }

  const cur = curQ.rows;
  const prv = prevQ.rows ?? [];

  console.log(`\n\x1b[1mForest Spa — Search Console report\x1b[0m`);
  console.log(`${current.startDate} → ${current.endDate}  (vs ${previous.startDate} → ${previous.endDate})`);
  console.log(`property: ${siteUrl}\n`);

  const ctr = (rows) => {
    const i = sum(rows, 'impressions');
    return i ? (sum(rows, 'clicks') / i) * 100 : 0;
  };

  // Prefer the true no-dimension totals; fall back to query sums if that call
  // was rejected. `T` rows carry the same metric fields, just un-dimensioned.
  const tot = (report, fallback) => (report.rows?.length ? report.rows : fallback);
  const cT = tot(curTotal, cur);
  const pT = tot(prevTotal, prv);

  console.log(
    table(
      ['metric', 'current', 'previous', 'change'],
      [
        ['Impressions', num(sum(cT, 'impressions')), num(sum(pT, 'impressions')), delta(sum(cT, 'impressions'), sum(pT, 'impressions'))],
        ['Clicks', num(sum(cT, 'clicks')), num(sum(pT, 'clicks')), delta(sum(cT, 'clicks'), sum(pT, 'clicks'))],
        ['CTR', `${ctr(cT).toFixed(2)}%`, `${ctr(pT).toFixed(2)}%`, delta(ctr(cT), ctr(pT))],
        ['Avg position', avgPosition(cT).toFixed(1), avgPosition(pT).toFixed(1), delta(avgPosition(pT), avgPosition(cT))],
        ['Distinct queries (named)', num(cur.length), num(prv.length), delta(cur.length, prv.length)],
      ],
    ),
  );
  console.log(
    `\n  Note: "distinct queries" counts only queries Search Console names.\n` +
      `  Anonymized long-tail queries still count toward impressions above, so\n` +
      `  the per-query tables below cover ${((sum(cur, 'impressions') / (sum(cT, 'impressions') || 1)) * 100).toFixed(0)}% of total impressions.`,
  );

  // How many URLs Google surfaces at all. After the migration this should be ~1,
  // which is precisely why sitelinks disappeared.
  if (pages.rows?.length) {
    console.log(`\n\x1b[1mURLs earning impressions\x1b[0m — ${pages.rows.length} total`);
    console.log(
      table(
        ['page', 'impr', 'clicks', 'pos'],
        pages.rows.slice(0, 12).map((r) => [
          r.keys[0].replace(/^https?:\/\/(www\.)?forestspamassage\.com/, '') || '/',
          num(r.impressions),
          num(r.clicks),
          r.position.toFixed(1),
        ]),
      ),
    );
    if (pages.rows.length <= 2) {
      console.log(
        `\n  ⚠ Only ${pages.rows.length} URL(s) rank. Google needs multiple indexable pages\n` +
          `    before it can generate sitelinks, and one page can only carry one\n` +
          `    title/H1/description — so long-tail service queries stay unserved.`,
      );
    }
  }

  if (daily.rows?.length) {
    console.log(`\n\x1b[1mDaily impressions\x1b[0m`);
    const max = Math.max(...daily.rows.map((r) => r.impressions));
    const step = Math.max(1, Math.ceil(daily.rows.length / 30));
    console.log(
      table(
        ['date', 'impr', 'clicks', ''],
        daily.rows
          .filter((_, i) => i % step === 0)
          .map((r) => [r.keys[0], num(r.impressions), num(r.clicks), bar(r.impressions, max, 30)]),
      ),
    );
  }

  const top = [...cur].sort((a, b) => b.impressions - a.impressions);
  console.log(`\n\x1b[1mTop queries by impressions\x1b[0m`);
  console.log(
    table(
      ['query', 'impr', 'clicks', 'ctr', 'pos'],
      top.slice(0, args.queries).map((r) => [
        r.keys[0],
        num(r.impressions),
        num(r.clicks),
        `${(r.ctr * 100).toFixed(1)}%`,
        r.position.toFixed(1),
      ]),
    ),
  );

  // Per-query impression deltas: the clearest read on what the migration cost.
  const prevMap = new Map(prv.map((r) => [r.keys[0], r]));
  const curMap = new Map(cur.map((r) => [r.keys[0], r]));
  const allQueries = new Set([...prevMap.keys(), ...curMap.keys()]);
  const diffs = [...allQueries]
    .map((q) => {
      const a = curMap.get(q);
      const b = prevMap.get(q);
      return {
        q,
        cur: a?.impressions ?? 0,
        prev: b?.impressions ?? 0,
        change: (a?.impressions ?? 0) - (b?.impressions ?? 0),
        pos: a?.position ?? null,
      };
    })
    .filter((d) => d.change !== 0);

  const losses = diffs.filter((d) => d.change < 0).sort((a, b) => a.change - b.change);
  const gains = diffs.filter((d) => d.change > 0).sort((a, b) => b.change - a.change);

  if (losses.length) {
    console.log(`\n\x1b[1mBiggest impression losses\x1b[0m — queries Google shows us less for`);
    console.log(
      table(
        ['query', 'was', 'now', 'lost'],
        losses.slice(0, 15).map((d) => [d.q, num(d.prev), num(d.cur), num(d.change)]),
      ),
    );
    const lostOnly = losses.filter((d) => d.cur === 0);
    if (lostOnly.length) {
      console.log(
        `\n  ${lostOnly.length} queries dropped to zero impressions ` +
          `(${num(lostOnly.reduce((t, d) => t - d.change, 0))} impressions lost outright).`,
      );
    }
  }
  if (gains.length) {
    console.log(`\n\x1b[1mBiggest impression gains\x1b[0m`);
    console.log(
      table(
        ['query', 'was', 'now', 'gained'],
        gains.slice(0, 8).map((d) => [d.q, num(d.prev), num(d.cur), `+${num(d.change)}`]),
      ),
    );
  }

  /* ---- Service-term coverage: the case for (or against) sub-pages -------- */
  console.log(`\n\x1b[1mService-term coverage\x1b[0m — is Google surfacing the whole menu?`);
  const buckets = SERVICE_TERMS.map(([label, needles]) => {
    const rows = cur.filter((r) => needles.some((n) => r.keys[0].toLowerCase().includes(n)));
    return {
      label,
      queries: rows.length,
      impressions: sum(rows, 'impressions'),
      clicks: sum(rows, 'clicks'),
      pos: rows.length ? avgPosition(rows) : null,
    };
  }).sort((a, b) => b.impressions - a.impressions);

  const maxImp = Math.max(1, ...buckets.map((b) => b.impressions));
  console.log(
    table(
      ['service term', 'queries', 'impr', 'clicks', 'avg pos', ''],
      buckets.map((b) => [
        b.label,
        num(b.queries),
        num(b.impressions),
        num(b.clicks),
        b.pos ? b.pos.toFixed(1) : '–',
        bar(b.impressions, maxImp, 20),
      ]),
    ),
  );

  const buried = buckets.filter((b) => b.impressions > 0 && b.pos > 10);
  const absent = buckets.filter((b) => b.impressions === 0);
  console.log();
  if (buried.length) {
    console.log(
      `  ▸ ${buried.length} service terms rank past page 1 (pos > 10): ` +
        `${buried.map((b) => b.label).join(', ')}.\n` +
        `    These already get impressions but almost no clicks — a dedicated page\n` +
        `    with its own title/H1/URL is the standard lever for lifting them.`,
    );
  }
  if (absent.length) {
    console.log(
      `  ▸ ${absent.length} service terms get zero impressions: ` +
        `${absent.map((b) => b.label).join(', ')}.\n` +
        `    Google is not surfacing these services at all — pure untapped demand.`,
    );
  }
  console.log();
}

main().catch((err) => {
  console.error(`\n✗ ${err.message}\n`);
  process.exitCode = 1;
});
