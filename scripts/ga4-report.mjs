#!/usr/bin/env node
/**
 * Forest Spa — GA4 traffic report.
 *
 * Pulls the numbers the owner actually asks for — pageviews, new users, the
 * trend over time, and how many people really clicked a "Book" CTA — straight
 * from the GA4 Data API and prints them as a terminal report.
 *
 * Zero dependencies: signs a service-account JWT with node:crypto, exchanges it
 * for an access token, then calls the Data API over plain REST. Nothing is added
 * to the site's package.json, so this never touches the production build.
 *
 * Setup (one time):
 *   1. Google Cloud console → enable the "Google Analytics Data API".
 *   2. Create a service account, then create a JSON key for it.
 *   3. GA4 admin → Property access management → add the service account's email
 *      as **Viewer** on the Forest Spa property.
 *   4. GA4 admin → Property details → copy the numeric **Property ID**
 *      (a 9-digit number like 123456789 — NOT the G-LFG2M4FT7Y measurement ID).
 *   5. Put both in .env (already gitignored):
 *        GA4_PROPERTY_ID=123456789
 *        GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/key.json
 *
 * Usage:
 *   node scripts/ga4-report.mjs                 # last 7 days vs previous 7
 *   node scripts/ga4-report.mjs --days 28       # last 28 days vs previous 28
 *   node scripts/ga4-report.mjs --site-only     # exclude Fresha booking pages
 *   node scripts/ga4-report.mjs --json          # machine-readable output
 *
 * Why --site-only matters: the Fresha venue posts to the SAME GA4 property
 * (its tracking code is G-LFG2M4FT7Y), so by default every total mixes website
 * visitors with Fresha booking-page visitors. --site-only restricts to
 * www.forestspamassage.com; the hostname section always shows the split.
 */

import './lib/proxy.mjs';
import { config, getAccessToken, SCOPES, num, delta, bar, table, windows } from './lib/google-auth.mjs';

const SITE_HOST = 'www.forestspamassage.com';

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

function parseArgs(argv) {
  const args = { days: 7, siteOnly: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--days') args.days = Number(argv[++i]);
    else if (a === '--site-only') args.siteOnly = true;
    else if (a === '--json') args.json = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  if (!Number.isInteger(args.days) || args.days < 1 || args.days > 365) {
    throw new Error(`--days must be an integer between 1 and 365 (got ${args.days})`);
  }
  return args;
}

/* -------------------------------------------------------------------------- */
/*  Data API                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Run one GA4 report. Returns `{ rows }` on success, or `{ error }` when the
 * request is rejected — so an unregistered custom dimension degrades into a
 * skipped section instead of killing the whole report.
 */
async function runReport(propertyId, token, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  const json = await res.json();
  if (!res.ok) return { error: json.error?.message ?? `HTTP ${res.status}` };

  const dimNames = (json.dimensionHeaders ?? []).map((h) => h.name);
  const metNames = (json.metricHeaders ?? []).map((h) => h.name);
  const rows = (json.rows ?? []).map((r) => {
    const out = {};
    dimNames.forEach((n, i) => (out[n] = r.dimensionValues[i].value));
    metNames.forEach((n, i) => (out[n] = Number(r.metricValues[i].value)));
    return out;
  });
  return { rows, totals: json.totals?.[0]?.metricValues?.map((v) => Number(v.value)) ?? [] };
}

const hostFilter = (host) => ({
  filter: { fieldName: 'hostName', stringFilter: { matchType: 'EXACT', value: host } },
});

/** First row of a report, or `{}` — a rejected report has no `rows` at all. */
const firstRow = (report) => (report.rows ?? [])[0] ?? {};

const eventFilter = (name) => ({
  filter: { fieldName: 'eventName', stringFilter: { matchType: 'EXACT', value: name } },
});

/* -------------------------------------------------------------------------- */
/*  Report                                                                    */
/* -------------------------------------------------------------------------- */

const HELP = `
Forest Spa GA4 traffic report

  node scripts/ga4-report.mjs [--days N] [--site-only] [--json]

  --days N      window size; compares the last N days against the N before (default 7)
  --site-only   restrict to ${SITE_HOST} (excludes Fresha booking pages)
  --json        emit raw JSON instead of the formatted report

Requires GA4_PROPERTY_ID and GOOGLE_APPLICATION_CREDENTIALS (see file header).
`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    return;
  }

  const env = config();
  const propertyId = env.GA4_PROPERTY_ID;
  const keyFile = env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!propertyId || !keyFile) {
    console.error(
      'Missing credentials.\n' +
        `  GA4_PROPERTY_ID              ${propertyId ? '✓ set' : '✗ missing — numeric property id, not G-LFG2M4FT7Y'}\n` +
        `  GOOGLE_APPLICATION_CREDENTIALS ${keyFile ? '✓ set' : '✗ missing — path to service-account JSON key'}\n` +
        '\nSee the setup steps at the top of scripts/ga4-report.mjs.',
    );
    process.exitCode = 1;
    return;
  }

  const token = await getAccessToken(keyFile, SCOPES.analytics);
  const { current, previous } = windows(args.days);
  const scope = args.siteOnly ? { dimensionFilter: hostFilter(SITE_HOST) } : {};

  const CORE = ['screenPageViews', 'activeUsers', 'newUsers', 'sessions', 'eventCount'];
  const mk = (range, metrics, extra = {}) => ({
    dateRanges: [range],
    metrics: metrics.map((name) => ({ name })),
    ...extra,
  });

  const [cur, prev, curBook, prevBook, daily, hosts, channels, ctas, purch, prevPurch] =
    await Promise.all([
      runReport(propertyId, token, mk(current, CORE, scope)),
      runReport(propertyId, token, mk(previous, CORE, scope)),
      runReport(propertyId, token, mk(current, ['eventCount', 'totalUsers'], {
        dimensionFilter: args.siteOnly
          ? { andGroup: { expressions: [hostFilter(SITE_HOST), eventFilter('book_click')] } }
          : eventFilter('book_click'),
      })),
      runReport(propertyId, token, mk(previous, ['eventCount', 'totalUsers'], {
        dimensionFilter: args.siteOnly
          ? { andGroup: { expressions: [hostFilter(SITE_HOST), eventFilter('book_click')] } }
          : eventFilter('book_click'),
      })),
      runReport(propertyId, token, mk(current, ['screenPageViews', 'activeUsers', 'newUsers'], {
        dimensions: [{ name: 'date' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
        ...scope,
      })),
      runReport(propertyId, token, mk(current, ['screenPageViews', 'activeUsers'], {
        dimensions: [{ name: 'hostName' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      })),
      runReport(propertyId, token, mk(current, ['sessions', 'activeUsers', 'keyEvents', 'ecommercePurchases'], {
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        ...scope,
      })),
      // cta_location must be registered as a custom dimension in GA4 admin.
      runReport(propertyId, token, mk(current, ['eventCount'], {
        dimensions: [{ name: 'customEvent:cta_location' }],
        dimensionFilter: eventFilter('book_click'),
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 15,
      })),
      // `purchases` is a UI label; the Data API metric is `ecommercePurchases`.
      runReport(propertyId, token, mk(current, ['keyEvents', 'ecommercePurchases'], scope)),
      runReport(propertyId, token, mk(previous, ['keyEvents', 'ecommercePurchases'], scope)),
    ]);

  if (cur.error) throw new Error(`GA4 rejected the core report: ${cur.error}`);

  if (args.json) {
    console.log(JSON.stringify({ current, previous, cur, prev, curBook, prevBook, daily, hosts, channels, ctas, purch, prevPurch }, null, 2));
    return;
  }

  const c = firstRow(cur);
  const p = firstRow(prev);
  const cb = firstRow(curBook);
  const pb = firstRow(prevBook);
  const cp = firstRow(purch);
  const pp = firstRow(prevPurch);

  // Surface anything GA4 rejected. These are non-fatal (the affected rows read
  // "–"), but silently dropping the reason makes the report impossible to trust.
  const rejected = [
    ['book_click (current)', curBook],
    ['book_click (previous)', prevBook],
    ['key events / purchases (current)', purch],
    ['key events / purchases (previous)', prevPurch],
    ['daily trend', daily],
    ['hostnames', hosts],
    ['channels', channels],
  ].filter(([, r]) => r.error);
  if (rejected.length) {
    console.log('\n\x1b[33m⚠ some reports were rejected by GA4:\x1b[0m');
    for (const [label, r] of rejected) console.log(`   ${label}: ${r.error}`);
  }

  /** A metric row that GA4 rejected must read "–", never a misleading 0. */
  const row = (label, key, curRep, prevRep, curRow, prevRow) =>
    curRep.error
      ? [label, '–', '–', 'n/a']
      : [
          label,
          num(curRow[key] ?? 0),
          prevRep.error ? '–' : num(prevRow[key] ?? 0),
          prevRep.error ? 'n/a' : delta(curRow[key] ?? 0, prevRow[key] ?? 0),
        ];

  console.log(`\n\x1b[1mForest Spa — traffic report\x1b[0m`);
  console.log(
    `${current.startDate} → ${current.endDate}  (vs ${previous.startDate} → ${previous.endDate})` +
      `${args.siteOnly ? `  ·  ${SITE_HOST} only` : '  ·  all hostnames (website + Fresha)'}\n`,
  );

  console.log(
    table(
      ['metric', 'current', 'previous', 'change'],
      [
        row('Pageviews', 'screenPageViews', cur, prev, c, p),
        row('Active users', 'activeUsers', cur, prev, c, p),
        row('New users', 'newUsers', cur, prev, c, p),
        row('Sessions', 'sessions', cur, prev, c, p),
        row('— Book clicks (events)', 'eventCount', curBook, prevBook, cb, pb),
        row('— Book clicks (people)', 'totalUsers', curBook, prevBook, cb, pb),
        row('Key events', 'keyEvents', purch, prevPurch, cp, pp),
        row('Purchases (Fresha)', 'ecommercePurchases', purch, prevPurch, cp, pp),
      ],
    ),
  );

  // Click-through rate on the booking CTAs is the number that explains a slow
  // month better than raw traffic does: same visitors, fewer of them booking.
  const ctr = (b, u) => (u ? `${((b / u) * 100).toFixed(2)}%` : '–');
  console.log(
    `\n\x1b[1mBook-click rate\x1b[0m   ${ctr(cb.totalUsers ?? 0, c.activeUsers ?? 0)} of visitors` +
      `   (previous ${ctr(pb.totalUsers ?? 0, p.activeUsers ?? 0)})`,
  );

  if (daily.rows?.length) {
    console.log(`\n\x1b[1mDaily trend\x1b[0m (pageviews)`);
    const max = Math.max(...daily.rows.map((r) => r.screenPageViews));
    console.log(
      table(
        ['date', 'views', 'users', 'new', ''],
        daily.rows.map((r) => [
          `${r.date.slice(0, 4)}-${r.date.slice(4, 6)}-${r.date.slice(6)}`,
          num(r.screenPageViews),
          num(r.activeUsers),
          num(r.newUsers),
          bar(r.screenPageViews, max),
        ]),
      ),
    );
  }

  if (hosts.rows?.length) {
    console.log(`\n\x1b[1mBy hostname\x1b[0m — website vs Fresha booking pages`);
    console.log(
      table(
        ['hostname', 'views', 'users'],
        hosts.rows.slice(0, 8).map((r) => [r.hostName || '(not set)', num(r.screenPageViews), num(r.activeUsers)]),
      ),
    );
  }

  if (channels.rows?.length) {
    // Booking rate per channel is what separates "more traffic" from "more
    // customers" — a channel can dominate sessions and still buy nothing.
    console.log(`\n\x1b[1mTraffic sources\x1b[0m — with booking rate per channel`);
    console.log(
      table(
        ['channel', 'sessions', 'users', 'books', 'rate'],
        channels.rows.slice(0, 10).map((r) => [
          r.sessionDefaultChannelGroup || '(other)',
          num(r.sessions),
          num(r.activeUsers),
          num(r.ecommercePurchases ?? 0),
          r.activeUsers ? `${(((r.ecommercePurchases ?? 0) / r.activeUsers) * 100).toFixed(2)}%` : '–',
        ]),
      ),
    );
  }

  console.log(`\n\x1b[1mWhich Book button got clicked\x1b[0m`);
  if (ctas.error) {
    console.log(
      `  (unavailable — register "cta_location" as a custom dimension:\n` +
        `   GA4 admin → Custom definitions → Create custom dimension,\n` +
        `   scope = Event, event parameter = cta_location. Data appears going forward.)\n` +
        `   API said: ${ctas.error}`,
    );
  } else if (!ctas.rows.length) {
    console.log('  (no book_click events in this window)');
  } else {
    const max = Math.max(...ctas.rows.map((r) => r.eventCount));
    console.log(
      table(
        ['cta_location', 'clicks', ''],
        ctas.rows.map((r) => [r['customEvent:cta_location'] || '(not set)', num(r.eventCount), bar(r.eventCount, max, 28)]),
      ),
    );
  }
  console.log();
}

main().catch((err) => {
  console.error(`\n✗ ${err.message}\n`);
  process.exitCode = 1;
});
