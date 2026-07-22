# Forest Spa — Website

Marketing site for **Forest Spa**, a massage & head spa sanctuary in Poway, CA. A fully static, high-performance single-page site built to migrate the business off Wix onto GitHub Pages while preserving brand, SEO, and Fresha booking continuity.

**Live (target):** https://www.forestspamassage.com

## Tech stack

- **[Astro 5](https://astro.build)** — static output, zero JavaScript by default
- **[Tailwind CSS v4](https://tailwindcss.com)** — CSS-first theme (`src/styles/global.css`)
- **React 19 islands** (`@astrojs/react`) — only the mobile drawer & service tabs ship JS
- **lucide-react** icons — rendered to inline SVG at build time in `.astro`, hydrated in islands
- **Self-hosted "The Seasons"** display font (the original brand face) + **Inter** for body
- `@astrojs/sitemap`, `sharp` responsive images (AVIF/WebP)

## Quick start

```bash
npm install
npm run dev        # local dev at http://localhost:4321
npm run build      # static build → dist/
npm run preview    # preview the production build
npm run check      # astro + TypeScript type-check
```

Requires Node 20+ (see `.nvmrc`).

## Project structure

```
src/
├─ data/siteData.ts          # ← single source of truth: copy, services, NAP, links, analytics
├─ styles/global.css         # design tokens (@theme), fonts, component classes
├─ lib/tracking.ts           # GA4 + Meta Pixel conversion tracking (delegated)
├─ layouts/Layout.astro      # <head>: SEO meta, DaySpa JSON-LD, analytics, font preloads
├─ components/
│  ├─ BrandMark.astro        # logo (inline SVG emblem + "The Seasons" wordmark)
│  ├─ react/                 # interactive islands: MobileNav, ServiceTabs
│  └─ sections/              # Header, Hero, Services, HeadSpa, PromoBanner, Story,
│                            #   Testimonials, Location, Footer, StickyMobileBar
└─ pages/index.astro         # single-page assembly
public/                      # favicons, og-image, fonts, CNAME, robots.txt, manifest
```

## Editing content

Almost everything a non-developer edits lives in **`src/data/siteData.ts`** — business info,
hours, services (grouped into the three tabs), promotions, amenities, testimonials, the Fresha
booking URLs, and SEO defaults. No copy is hard-coded in markup.

Brand colors and fonts live in the `@theme` block of **`src/styles/global.css`**.

## Analytics (optional)

GA4, Google Ads, and Meta Pixel are pre-wired but **off until configured**. Set the IDs as
environment variables (locally in `.env`, in CI as repository secrets):

```
PUBLIC_GA4_ID=G-XXXXXXXXXX
PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
PUBLIC_GOOGLE_ADS_BOOKING_LABEL=xxxxxxxxxxxxxxxx   # the "…/LABEL" part of the conversion
PUBLIC_META_PIXEL_ID=000000000000000
```

When set, the tags load (GA4 + Ads share one `gtag.js`) and every booking / call CTA fires a
conversion event (`book_click` + `generate_lead` / Ads `conversion` / Meta `Schedule`;
`phone_call` / Meta `Contact`) via the delegated listener in `src/lib/tracking.ts`. When
unset, nothing renders.

> These `PUBLIC_*` values are public identifiers — they appear in the page HTML that every
> visitor downloads, so they are **not secrets** and are safe to commit. They're kept in env
> vars mainly so forks / preview builds don't pollute production analytics. What you must
> **never** commit: server-side secrets like a Meta Conversions API token, a GA4 Measurement
> Protocol API secret, or Google Ads API tokens. Prefer storing even the public IDs as
> **GitHub Actions repo secrets** (Settings → Secrets and variables → Actions); `deploy.yml`
> already reads them.

## Deployment (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml` (official `withastro/action` →
`actions/deploy-pages`). One-time setup:

1. **Repo → Settings → Pages → Source: "GitHub Actions".**
2. *(Optional)* add `PUBLIC_GA4_ID` / `PUBLIC_META_PIXEL_ID` under **Settings → Secrets and
   variables → Actions**.
3. Push to `main`. The site builds and deploys automatically.

### Domain / base path (preview vs. production)

Because the domain is still live on Wix, the deploy defaults to a **safe preview** at the
github.io project URL, controlled by a repository **variable** `PAGES_BASE` (Settings →
Secrets and variables → Actions → *Variables*):

| Mode | `PAGES_BASE` | Result |
| --- | --- | --- |
| Preview (safe) | `/forest-spa-massage` | Deploys to `https://augustinursus.github.io/forest-spa-massage/`; CNAME is dropped, so live Wix is untouched. |
| Production cutover | *(unset / delete it)* | Deploys for the custom domain `https://www.forestspamassage.com` at the web root (ships `public/CNAME`). |

`astro.config.mjs` reads `SITE_URL` / `BASE_PATH` (set for you by the workflow from
`PAGES_BASE`), so no code edits are needed to switch.

## Wix → GitHub Pages cutover checklist

1. Deploy in **preview** mode (`PAGES_BASE=/forest-spa-massage`) and verify everything at the
   github.io URL — Wix stays live and untouched.
2. When happy, **delete the `PAGES_BASE` variable** and re-run the deploy (Actions → *Deploy to
   GitHub Pages* → *Run workflow*). This builds for the custom domain and ships `public/CNAME`.
3. In **Settings → Pages**, confirm the custom domain is `www.forestspamassage.com` and enable
   **Enforce HTTPS** (after DNS below verifies).
4. At your DNS provider, point:
   - `www` → `CNAME` → `augustinursus.github.io`
   - apex `forestspamassage.com` → `ALIAS`/`ANAME` to the Pages IPs (or redirect to `www`)
5. Wait for DNS + certificate provisioning, then verify the live site.
6. SEO continuity is preserved: same title/description intent, canonical `www` host, identical
   Fresha booking URLs, `DaySpa` structured data, and 301-style redirects for every legacy Wix URL.
7. Only after verifying the live site, cancel Wix / repoint the domain away from it.

## Assets & fonts

Photos, the logo, and the "The Seasons" font were reused from the existing brand assets and
re-optimized. See `CLAUDE.md` for the full asset inventory, source URLs, and brand palette.
