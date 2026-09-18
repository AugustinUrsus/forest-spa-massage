/**
 * Proxy bootstrap — import this FIRST in any script that calls fetch().
 *
 * This machine routes outbound traffic through a local HTTP proxy (the Apple
 * Claude Code sandbox sets HTTP_PROXY/HTTPS_PROXY). Node's built-in fetch
 * ignores those variables unless NODE_USE_ENV_PROXY=1, and Node reads that at
 * startup — too late to set from inside the process. So when a proxy is
 * configured but the flag is missing, re-exec ourselves once with it enabled.
 *
 * Keeps `node scripts/ga4-report.mjs` working as documented instead of failing
 * with a bare "fetch failed", and is a no-op on machines with no proxy.
 */

const hasProxy = Boolean(
  process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy,
);

if (hasProxy && !process.env.NODE_USE_ENV_PROXY) {
  const { spawnSync } = await import('node:child_process');
  const result = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
  });
  process.exit(result.status ?? 1);
}
