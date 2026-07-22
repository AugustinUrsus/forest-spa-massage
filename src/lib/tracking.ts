/**
 * Analytics + outbound-conversion tracking.
 *
 * GA4 (gtag) and Meta Pixel (fbq) base tags are injected by Layout.astro only
 * when their IDs are configured (PUBLIC_GA4_ID / PUBLIC_META_PIXEL_ID). This
 * module wires a single delegated click listener so every booking / call CTA
 * reports a conversion — including CTAs rendered inside React islands, which
 * emit real `<a data-book>` DOM nodes and are therefore caught by delegation.
 */

type Params = Record<string, unknown>;

import { analytics } from '../data/siteData';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    fsTrack?: (event: string, params?: Params) => void;
  }
}

/** Fire a GA4 event (no-op if gtag isn't loaded). */
export function track(event: string, params: Params = {}): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') window.gtag('event', event, params);
}

/** Fire a Meta Pixel standard event (no-op if fbq isn't loaded). */
function metaTrack(event: string, params: Params = {}): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', event, params);
}

/** Fire a Google Ads conversion for a booking click (no-op unless configured). */
function adsBookingConversion(): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  if (!analytics.googleAdsId) return;
  const sendTo = analytics.adsBookingLabel
    ? `${analytics.googleAdsId}/${analytics.adsBookingLabel}`
    : analytics.googleAdsId;
  window.gtag('event', 'conversion', { send_to: sendTo });
}

/**
 * Attach the global delegated listener. Elements opt in via data attributes:
 *   data-book="<cta location>"  → Fresha booking click  (GA4 book_click + generate_lead, Meta Schedule)
 *   data-call="<cta location>"  → phone tap             (GA4 phone_call, Meta Contact)
 */
export function initTracking(): void {
  if (typeof document === 'undefined') return;
  window.fsTrack = track;

  document.addEventListener(
    'click',
    (e) => {
      const el = e.target as HTMLElement | null;

      const bookEl = el?.closest<HTMLElement>('[data-book]');
      if (bookEl) {
        const location = bookEl.getAttribute('data-book') || 'unknown';
        track('book_click', { method: 'fresha', cta_location: location });
        track('generate_lead', { cta_location: location });
        metaTrack('Schedule', { content_name: location });
        adsBookingConversion();
        return;
      }

      const callEl = el?.closest<HTMLElement>('[data-call]');
      if (callEl) {
        track('phone_call', { cta_location: callEl.getAttribute('data-call') || 'unknown' });
        metaTrack('Contact', { method: 'phone' });
      }
    },
    { capture: true },
  );
}
