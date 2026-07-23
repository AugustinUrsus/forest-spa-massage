# GEMINI.md — Forest Spa Website

Durable guide and technical reference for **Forest Spa** (Poway, CA). Migrated from Wix to **Astro 5 + Tailwind CSS v4 + React 19 islands**, deployed on **GitHub Pages**.

> **Git & Repository Policy:**
> - **No AI attribution** in git commit messages or code comments.
> - **Never commit or push** unless explicitly asked by the user.

---

## 1. Tech Stack & Engineering Overview

- **Framework:** [Astro 5](https://astro.build/) (Static Site Generation / SSG, zero JavaScript by default).
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first configuration via `@theme` in `src/styles/global.css`, using `@tailwindcss/vite`).
- **UI Islands:** React 19 (`@astrojs/react`) for interactive islands (`ServiceTabs`, `TestimonialCarousel`, `MobileNav`).
- **Icons:** `lucide-react` (static-rendered in Astro components, hydrated in React islands).
- **Typography:** 
  - Display: **"The Seasons"** (self-hosted woff2 in `public/fonts/`, subsetted to clean glyphs `A-Z a-z 0-9 , . : ; ?`) with **Playfair Display** (`@fontsource-variable/playfair-display`) fallback for unsupported glyphs (`&`, `-`, `/`, `'`, etc.).
  - Body: **Inter** (`@fontsource-variable/inter`).
- **Image Optimization:** `sharp` build-time optimization for responsive AVIF/WebP images.
- **Sitemap & SEO:** `@astrojs/sitemap` filtered to canonical URLs.

### Developer Commands
- `npm run dev` / `npm run start` — Start local dev server
- `npm run build` — Build static production output in `dist/`
- `npm run preview` — Preview built static site locally
- `npm run check` — Typecheck Astro & TypeScript files (`astro check`)

---

## 2. Page Structure & Component Map

The site operates as a high-conversion single-page experience defined in `src/pages/index.astro`. The section order is strictly enforced and intentional:

```
Header
  ↓
Hero (#top)
  ↓
Services (#services)
  ↓
Packages (#packages)
  ↓
MonthlySpecial (#specials)
  ↓
HeadSpa (#head-spa)
  ↓
Membership (#membership)
  ↓
Story (#story)
  ↓
Testimonials
  ↓
GiftCard (#gift-cards)
  ↓
Location (#location)
  ↓
Footer
  ↓
StickyMobileBar
```

### Component Architecture & Guidelines
- **Sections:** Located in `src/components/sections/*.astro`.
- **React Islands:** Located in `src/components/react/*.tsx` (`ServiceTabs`, `TestimonialCarousel`, `MobileNav`).
- **Navigation Links:** Defined in `src/data/siteData.ts` (`navLinks`), driving Header and Mobile Nav drawer. Must stay in sync with section IDs.
- **Visual Background Rhythm:** Alternates light and dark sections to maintain aesthetic balance:
  - Hero (Charcoal) → Services (`bg-sand-deep`) → Packages → MonthlySpecial (Charcoal) → HeadSpa (`bg-cloud`) → … → GiftCard (Charcoal) → Location.
  - The gradient bottom fade of the Hero section (`to-sand-deep`) must strictly match the background of the section immediately following it.
- **Hero Responsiveness:**
  - Subhead is `hidden sm:block` (hidden on mobile phones per owner preference).
  - Background image uses `object-[64%_center] sm:object-center` so candles show cleanly on mobile without obstructing headline text.
  - Features 3 key CTAs: Book Appointment (`booking.primary`), Explore Services (`#services`), and Gift Cards (`booking.giftCards`).

---

## 3. Booking Link Conventions (Fresha Integration)

All CTAs route to **Fresha** via deep links. Two URL patterns exist in `src/data/siteData.ts`:

1. **Standard Per-Item Deep Link:**
   - Generated via helper function: `bookingUrl(offerId)`
   - URL Format: `${FRESHA_VENUE}/booking?offerItemId=<id>&share=true&pId=2602780&dppub=true`
   - Used for à-la-carte services, packages, head spa cards, and monthly specials.
2. **Custom Cart Link Overrides:**
   - Specified via optional `url` property on `Service` objects in `siteData.ts`.
   - Used when opening a prebuilt Fresha cart directly (e.g., **Four Hands · 90 min** uses its own `cartId`).
   - Component logic in `Services.astro`: `s.url ?? bookingUrl(s.id)`.

### Named Booking Targets (`siteData.ts > booking`)
- `primary`: All-offer venue booking (`.../book-now/forest-spa-kbi5ew52/all-offer?share=true&pId=2602780`).
- `headSpa`: Direct signature head-spa cart link.
- `giftCards`: Direct gift cards link (`.../book-now/forest-spa-kbi5ew52/gift-cards?share=true&pId=2602780`).
- `FRESHA_VENUE`: `https://www.fresha.com/a/forest-spa-poway-14168-poway-road-msk4ljro`
- `FRESHA_PID`: `2602780`
- **Memberships:** `memberships[].joinUrl` targets Fresha paid plans (`.../paid-plans/details?pId=2602780`, with `selected=3172024` for the $98 Plus plan).

---

## 4. Business Facts & Data Integrity

### Business Info (NAP)
- **Business Name:** Forest Spa — Massage Spa & Head Spa Sanctuary
- **Address:** 14168 Poway Rd, Ste 206, Poway, CA 92064 (Geo: `32.95595, -117.03555`)
- **Phone:** (858) 288-2600 (`tel:+18582882600`)
- **Email:** `forestspa206@gmail.com`
- **Operating Hours:** Mon–Sun, 9:00 AM – 9:00 PM (Uniform 7 days/week)
- **Key Attributes:** Free on-site + street parking, LGBTQ-friendly, Transgender safe space, Couples suite available.
- **Offers:** 10% off couple sessions, Cash discount at checkout.

### Data & Content Constraints (Owner-Enforced)
- **No "hot towels":** Never mention hot towels in service descriptions or inclusions. "Hot stones" and "herbal heat pack" are allowed.
- **Add-on Durations:** Most add-ons are incorporated into the massage time without adding duration; standalone booking durations are still indicated per item.
- **TMJ Add-ons:** Must explicitly list the eye mask and included items in the description.
- **Testimonials:** Use strictly authentic 5-star reviews formatted with first name + last initial (e.g. `Sam T.`). Never fabricate reviews.
- **Monthly Special:** Updated monthly in `siteData.ts` (`monthlySpecial`). Rendered in `MonthlySpecial.astro` and Hero ribbon.

---

## 5. Brand System & Design Tokens

### Color Palette
- **Sand (Base):** `#E5DDD0`
- **Sand Deep:** `#DCD2C2`
- **Cloud:** `#FFFFFF`
- **Ink / Text:** `#000000` (Main), `#4A463D` (Soft)
- **Bronze (Primary CTA):** `#6B5C35` (Hover/Deep: `#574A2A`)
- **Charcoal (Dark Sections):** `#2E2E2B`
- **Sage (Logo / Accent):** `#8FA58F`
- **Gold (Dark Section Accent):** `#B7A57E`

### Typography & Fonts
- **Headings:** Brand display font **"The Seasons"** (self-hosted).
  - *Subset Note:* Demo version stamps "DEMO" on non-standard punctuation. Font is subsetted for `A-Z a-z 0-9 , . : ; ?`. Other symbols (e.g., `&`, `-`, `/`) fall back to **Playfair Display**.
  - Re-subsetting command:
    ```bash
    python3 -m fontTools.subset in.ttf --unicodes="U+0020,U+002C,U+002E,U+003A,U+003B,U+003F,U+0030-0039,U+0041-005A,U+0061-007A" --flavor=woff2 --output-file=public/fonts/the-seasons-regular.woff2
    ```
- **Body:** **Inter** (`@fontsource-variable/inter`).

### Brand Logos
- Component: `src/components/BrandMark.astro`
- Variants: `horizontal` (dark text, light background), `stacked-light` (sage/gold text, dark background).
- Asset locations: `src/assets/images/logo-horizontal.png`, `logo-stacked-light.png`, favicons in `public/`.

---

## 6. SEO, Redirects & Analytics

### SEO Setup
- **Title Tag:** `Forest Spa | Best Massage & Head Spa in Poway, San Diego`
- **Meta Description:** Focuses on massage therapy in Poway/San Diego, rejuvenating mind, body, and soul.
- **Structured Data:** `DaySpa` / `HealthAndBeautyBusiness` JSON-LD schema embedded in `src/layouts/Layout.astro`.
- **Legacy Wix Redirects:** Defined in `astro.config.mjs`. All old Wix indexed URLs (e.g. `/services`, `/head-spa`, `/packages`, and 34 `/service-page/*` paths) are redirected with static meta-refresh + canonical headers pointing to their respective in-page anchors (`#services`, `#head-spa`, `#specials`, `#story`, `#top`).

### Analytics & Event Tracking
- Integrated in `src/layouts/Layout.astro` and gated on environment variables:
  - `PUBLIC_GA4_ID` (Google Analytics 4)
  - `PUBLIC_GOOGLE_ADS_ID` & `PUBLIC_GOOGLE_ADS_BOOKING_LABEL`
  - `PUBLIC_META_PIXEL_ID`
- Event listener in `src/lib/tracking.ts`:
  - `[data-book]` triggers `book_click` / `generate_lead` (GA4), `Schedule` (Meta), and Google Ads conversion.
  - `[data-call]` triggers `phone_call` (GA4) and `Contact` (Meta).

---

## 7. Deployment Configuration

- **Platform:** GitHub Pages via `.github/workflows/deploy.yml` (`withastro/action`).
- **Domain Configuration:** Managed dynamically via environment variables in `astro.config.mjs`:
  - **Production (Custom Domain):** `SITE_URL=https://www.forestspamassage.com`, `BASE_PATH=/` (default).
  - **GitHub Preview Path:** `SITE_URL=https://augustinursus.github.io`, `BASE_PATH=/forest-spa-massage`.
