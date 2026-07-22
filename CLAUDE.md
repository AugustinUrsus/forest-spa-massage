# CLAUDE.md — Forest Spa website

Static marketing site for **Forest Spa** (Poway, CA), migrated from Wix to **Astro + Tailwind v4 + React islands**, deployed on **GitHub Pages**. This file is the durable record of the business facts, brand, assets, SEO, and deploy settings so the live Wix site never needs to be re-scraped.

> Workspace-wide engineering conventions live in `../CLAUDE.md`. **Git policy: no AI attribution in commits; never commit/push unless explicitly asked.**

## Tech stack
- **Astro 5** (SSG, zero-JS by default) · **Tailwind CSS v4** (CSS-first `@theme` in `src/styles/global.css`, via `@tailwindcss/vite`) · **React 19** islands (`@astrojs/react`) · **lucide-react** icons (static-rendered in `.astro`, hydrated in islands) · `@astrojs/sitemap` · `sharp` image optimization · **Inter** body font (`@fontsource-variable/inter`) + self-hosted **"The Seasons"** display font.
- Build: `npm run build` → static HTML in `dist/`. Dev: `npm run dev`.

## Business facts (NAP)
- **Name:** Forest Spa — Massage Spa & Head Spa Sanctuary
- **Address:** 14168 Poway Rd, Ste 206, Poway, CA 92064  ·  geo ≈ 32.95595, -117.03555
- **Phone:** (858) 288-2600  ·  tel:+18582882600
- **Email:** forestspa206@gmail.com
- **Hours:** Mon–Sun, 9:00 AM – 9:00 PM (uniform daily)
- **Attributes:** Free on-site + street parking · LGBTQ-friendly · Transgender safe space · Couples suite
- **Offers:** 10% off couple sessions · Cash discount at checkout
- **Taglines:** "Unwind. Recharge. Revive." / "Experience the best massage therapy in Poway, San Diego."

## Booking — Fresha (all CTAs point here)
- **Primary (all offers):** `https://www.fresha.com/book-now/forest-spa-kbi5ew52/all-offer?share=true&pId=2602780`
- **Services picker:** `https://www.fresha.com/book-now/forest-spa-kbi5ew52/services`
- **Gift cards:** `https://www.fresha.com/book-now/forest-spa-kbi5ew52/gift-cards?share=true&pId=2602780`
- Fresha slug also seen: `forest-spa-poway-14168-poway-road-msk4ljro`

## Socials
- Instagram: https://www.instagram.com/forestspamassage
- Facebook: https://www.facebook.com/profile.php?id=61577147368576
- TikTok: present on Wix but unconfigured (generic link) — omit until a real URL exists.

## Services (grouped into 3 tabs — see `src/data/siteData.ts`)
- **Signature Treatments:** Head Spa & Scalp Therapy, TMJ Therapy, Four Hands Massage
- **Massage Therapies:** Deep Tissue, Swedish, Thai, Sports, Prenatal, Reflexology
- **Add-ons & Wellness:** Aromatherapy, Cupping
- Real Wix copy also mentioned: Sports, TMJ Relief, Prenatal, Reflexology, Hand/Arm Massage. No public prices/durations → none invented.

## Brand system
- **Palette:** sand `#E5DDD0` (base) · sand-deep `#DCD2C2` · cloud `#FFFFFF` · ink `#000000` · ink-soft `#4A463D` · **bronze `#6B5C35`** (CTA) · bronze-deep `#574A2A` · charcoal `#2E2E2B` (dark sections) · sage `#8FA58F` (emblem) · gold `#B7A57E` (on-dark accent). Sage/gold/charcoal sampled from the real logo.
- **Fonts:** display = **"The Seasons"** (the Wix logo/hero face — `orig_fsp_demo_the_seasons`), self-hosted in `public/fonts/` (woff2+woff, ~6KB each, full 95-glyph ASCII). Body = Inter. Stack falls back to Playfair Display → Georgia per-glyph.
- **Logo:** rebuilt as scalable markup in `src/components/BrandMark.astro` (inline SVG pine emblem + "Forest Spa" wordmark). Original raster logo kept at `src/assets/images/logo-horizontal.png`.

## Assets (reused from the Wix CDN, re-optimized)
Source Wix host: `static.wixstatic.com/media/`. Local optimized copies:
- `src/assets/images/hero-ambiance.jpg` ← `f042476f…` (candles/diffuser — hero bg)
- `src/assets/images/head-spa.jpg` ← `f815ad0c…` (head-spa basin — Head Spa section)
- `src/assets/images/couples-room.jpg` ← `a58ec307…` (couples room w/ sage linens — Story/Location; original was a 29MB PNG, downscaled)
- `public/*` favicons + `og-image.jpg` (1200×630, dark brand lockup) ← emblem `81438fb…` and OG lockup `c64c2bdc…`
- Fonts pulled from `static.wixstatic.com/ufonts/24f85d_3d335c6…` (bold) & `…a02d4bfb…` (regular).

## SEO structure
- **Title:** `Forest Spa | Best Massage & Head Spa in Poway, San Diego` (Wix used "Forest Spa | Best Massage in Poway, San Diego").
- **Meta description:** massage therapy in Poway/San Diego, rejuvenate mind/body/soul.
- **Structured data:** `DaySpa`/`HealthAndBeautyBusiness` JSON-LD in `src/layouts/Layout.astro` — NAP, geo, `openingHoursSpecification` (all days 09:00–21:00), `sameAs`, `hasOfferCatalog` (all services), `ReserveAction` → Fresha.
- Canonical host: `https://www.forestspamassage.com` (www). Sitemap via `@astrojs/sitemap`, filtered to only the homepage. `public/robots.txt` allows all + sitemap.
- **Legacy-URL redirects (SEO migration):** the old Wix site had many indexed pages; collapsing to one page would 404 them. `astro.config.mjs > redirects` maps every indexed Wix URL (from its live sitemaps) to the matching in-page anchor as a static meta-refresh + `rel=canonical` + `noindex` stub — the best a static host allows for passing ranking equity. Mapping: `/services`→`#services`, `/head-spa`→`#head-spa`, `/promotions`,`/packages`,`/pricing-plans/list`→`#specials`, `/about-1`→`#story`, `/pain-expert`→`#services`, `/book`→`#top`, `/terms-conditions`→`#location`, and all 34 `/service-page/<slug>` → `#head-spa` (scalp/head/tmj slugs) or `#services`. If the old site adds/renames pages, refresh this list from `https://www.forestspamassage.com/sitemap.xml` (→ `pages-sitemap.xml`, `booking-services-sitemap.xml`). Title keeps the original ranking phrase "Best Massage in Poway, San Diego"; H1 matches too — do not change these casually.

## Analytics
- GA4 + Google Ads + Meta Pixel scaffolded in `Layout.astro`, gated on env vars **`PUBLIC_GA4_ID`**, **`PUBLIC_GOOGLE_ADS_ID`** (+ `PUBLIC_GOOGLE_ADS_BOOKING_LABEL`), and **`PUBLIC_META_PIXEL_ID`** (any unset → that tag doesn't render; one shared `gtag.js` load serves GA4 + Ads). Conversion tracking in `src/lib/tracking.ts`: a delegated listener fires GA4 `book_click`/`generate_lead` + Meta `Schedule` + Google Ads `conversion` on `[data-book]`, and `phone_call` + Meta `Contact` on `[data-call]`. These `PUBLIC_*` IDs are public by design (they appear in client HTML); real secrets (Meta CAPI token, GA4 Measurement Protocol secret, Google Ads API tokens) must NOT live here. Set values as GitHub Actions repo secrets (read by `deploy.yml`) or a local `.env` (gitignored).

## Deployment (GitHub Pages)
- Repo: `AugustinUrsus/forest-spa-massage` (project repo). Deploy via `.github/workflows/deploy.yml` (official `withastro/action`).
- **Domain switch is env-driven in `astro.config.mjs`:** defaults to custom domain at root (`SITE_URL=https://www.forestspamassage.com`, `BASE_PATH=/`) with `public/CNAME`. For the project-path preview instead: `SITE_URL=https://augustinursus.github.io`, `BASE_PATH=/forest-spa-massage` (then font `@font-face` paths in global.css need the base prefix).
- To finish the Wix → Pages cutover: enable Pages (source = GitHub Actions), point `www.forestspamassage.com` DNS (CNAME → `augustinursus.github.io`) + apex ALIAS/redirect, verify custom domain, keep the same title/description/Fresha links for SEO continuity.

## Re-fetching the source site
Domains are allowlisted in `~/.claude/apple/dangerous_allowed_domains.csv` (forestspamassage.com, static.wixstatic.com, fresha.com, registry.npmjs.org). Fetch with `curl` (WebFetch is sandbox-blocked). Raw Wix HTML is ~840KB; real copy is server-rendered and extractable by stripping tags.
