// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Deployment target is env-configurable so the same repo can ship to either a
 * custom domain at the web root (default — the forestspamassage.com migration)
 * or a GitHub project path (https://<user>.github.io/forest-spa-massage/).
 *
 *   Custom domain (default):  SITE_URL=https://www.forestspamassage.com  BASE_PATH=/
 *   Project path fallback:    SITE_URL=https://augustinursus.github.io    BASE_PATH=/forest-spa-massage
 */
const SITE_URL = process.env.SITE_URL || 'https://www.forestspamassage.com';
const BASE_PATH = process.env.BASE_PATH || '/';

/**
 * SEO migration — preserve every URL Google indexed on the old Wix site.
 * The site collapsed from many pages to one, so each legacy URL is redirected
 * (static meta-refresh + canonical) to the matching in-page section anchor.
 * This keeps ranking equity, prevents 404s, and consolidates signals to `/`.
 * Source URLs taken from the live Wix sitemaps (pages + booking-services).
 */
const legacyServicePages = [
  'computer-relief-prestige', 'computer-relief-preferred-1', 'thai-massage',
  'head-tmj-pain-relief-preferred-1', 'head-tmj-pain-relief-premier-1',
  'july-special-scalp-revival-body-massage', 'july-special-runner-rescue-preferred',
  'pain-management-therapy', 'four-hands-massage', 'signature-scalp-revival',
  'prenatal-massage', 'swedish-massage', 'foot-massage', 'upper-body-tension-release',
  'july-special-computer-relief-premier', 'new-client-special-pain-management',
  'head-to-toe-retreat-premier', 'scalp-revival-body-massage', 'upper-body-massage',
  'lomi-lomi-massage', 'july-special-pick-your-free-add-on', 'stone-scent-preferred-1',
  'stone-scent-premier', 'lymphatic-drainage-massage', 'sports-massage', 'couples-massage',
  'head-tmj-pain-relief-add-on', 'deep-tissue-massage', 'serenity-blend-premier',
  'head-to-toe-retreat-prestige', 'serenity-blend-preferred-1', 'stone-scent-prestige',
  'upper-body-tension-release-premiere', 'runner-rescue-premier',
];

/** @type {Record<string, string>} */
const redirects = {
  '/services': '/#services',
  '/head-spa': '/#head-spa',
  '/promotions': '/#specials',
  '/packages': '/#specials',
  '/book': '/#top',
  '/about-1': '/#story',
  '/pain-expert': '/#services',
  '/terms-conditions': '/#location',
  '/pricing-plans/list': '/#specials',
};
for (const slug of legacyServicePages) {
  // Head-spa / scalp / TMJ services land on the Head Spa feature; the rest on Services.
  redirects[`/service-page/${slug}`] = /scalp|head|tmj/.test(slug) ? '/#head-spa' : '/#services';
}

const homeUrl = new URL(BASE_PATH.endsWith('/') ? BASE_PATH : `${BASE_PATH}/`, SITE_URL).href;

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  redirects,
  integrations: [
    react(),
    // Only the real, canonical page belongs in the sitemap — not redirect stubs.
    sitemap({ filter: (page) => page === homeUrl }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Sharp is used at build time to emit responsive AVIF/WebP for src/assets images.
    responsiveStyles: true,
  },
  build: {
    // Inline small stylesheets to cut render-blocking requests (Lighthouse).
    inlineStylesheets: 'auto',
  },
});
