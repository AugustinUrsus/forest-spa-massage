/**
 * Shared Google API auth for the reporting scripts.
 *
 * Signs a service-account JWT with node:crypto and exchanges it for an access
 * token — no dependencies, so nothing lands in the site's package.json.
 * Used by ga4-report.mjs (Analytics Data API) and gsc-report.mjs (Search
 * Console API); each passes the scope it needs.
 */

import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';

export const SCOPES = {
  analytics: 'https://www.googleapis.com/auth/analytics.readonly',
  searchConsole: 'https://www.googleapis.com/auth/webmasters.readonly',
};

/** Read KEY=VALUE pairs out of .env without pulling in a dotenv dependency. */
export function loadDotEnv(path = new URL('../../.env', import.meta.url)) {
  let raw;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    return {};
  }
  const out = {};
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

/** Merged config: .env first, real environment wins. */
export function config() {
  return { ...loadDotEnv(), ...process.env };
}

const base64url = (input) => Buffer.from(input).toString('base64url');

/** Mint a short-lived access token from a service-account key file. */
export async function getAccessToken(keyFile, scope) {
  const key = JSON.parse(readFileSync(keyFile, 'utf8'));
  if (!key.client_email || !key.private_key) {
    throw new Error(`${keyFile} is not a service-account key (missing client_email/private_key)`);
  }

  const iat = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({ iss: key.client_email, scope, aud: TOKEN_URL, iat, exp: iat + 3600 }),
  );

  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${signer.sign(key.private_key, 'base64url')}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(
      `token exchange failed (${res.status}): ${body.error_description ?? JSON.stringify(body)}`,
    );
  }
  return body.access_token;
}

/* -------------------------------------------------------------------------- */
/*  Shared formatting                                                         */
/* -------------------------------------------------------------------------- */

export const num = (n) => Math.round(n).toLocaleString('en-US');

export function delta(cur, prev) {
  if (!prev) return cur ? '   new' : '     –';
  const pct = ((cur - prev) / prev) * 100;
  const sign = pct > 0 ? '+' : '';
  const arrow = pct > 0.05 ? '▲' : pct < -0.05 ? '▼' : '·';
  return `${arrow} ${sign}${pct.toFixed(1)}%`;
}

export function bar(value, max, width = 34) {
  if (max <= 0) return '';
  return '█'.repeat(Math.max(value > 0 ? 1 : 0, Math.round((value / max) * width)));
}

/** Render an aligned text table: first column left-aligned, rest right-aligned. */
export function table(headers, rows) {
  const all = [headers, ...rows];
  const w = headers.map((_, i) => Math.max(...all.map((r) => String(r[i] ?? '').length)));
  const line = (r, pad = ' ') =>
    r
      .map((c, i) =>
        i === 0 ? String(c ?? '').padEnd(w[i], pad) : String(c ?? '').padStart(w[i], pad),
      )
      .join('  ');
  return [
    line(headers),
    line(
      w.map((n) => '─'.repeat(n)),
      '─',
    ),
    ...rows.map((r) => line(r)),
  ].join('\n');
}

const iso = (d) => d.toISOString().slice(0, 10);

/**
 * Two adjacent windows of `days` each. `lagDays` backs the end date off from
 * today — GA4 needs 1 day, Search Console typically lags 2–3.
 */
export function windows(days, lagDays = 1) {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - lagDays);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  const prevEnd = new Date(start);
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setUTCDate(prevStart.getUTCDate() - (days - 1));
  return {
    current: { startDate: iso(start), endDate: iso(end) },
    previous: { startDate: iso(prevStart), endDate: iso(prevEnd) },
  };
}
