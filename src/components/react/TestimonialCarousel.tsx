import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Review {
  quote: string;
  author: string;
  source?: string;
  rating?: number;
}

export default function TestimonialCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const n = reviews.length;
  const paused = useRef(false);

  const go = useCallback((delta: number) => setIndex((p) => (p + delta + n) % n), [n]);

  // Auto-advance (paused on hover/focus and when reduced motion is preferred).
  useEffect(() => {
    if (n <= 1) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((p) => (p + 1) % n);
    }, 7000);
    return () => window.clearInterval(id);
  }, [n]);

  const r = reviews[index];

  return (
    <div
      className="relative mx-auto max-w-3xl text-center"
      role="group"
      aria-roledescription="carousel"
      aria-label="Guest reviews"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      <Quote size={56} strokeWidth={1.5} className="mx-auto text-sage opacity-20" aria-hidden="true" />

      <blockquote
        key={index}
        className="display-heading mx-auto mt-6 flex min-h-[8.5rem] max-w-2xl items-center justify-center text-xl leading-relaxed text-sand sm:min-h-[7.5rem] sm:text-2xl"
        style={{ animation: 'reveal-in 0.5s var(--ease-out-soft) both' }}
      >
        {r.quote}
      </blockquote>

      <figcaption className="mt-8 text-sand/70">
        — {r.author}
        {r.source ? ` · ${r.source}` : ''}
      </figcaption>

      {n > 1 && (
        <div className="mt-10 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous review"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand/25 text-sand transition-colors hover:border-gold hover:text-gold"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2.5" role="tablist" aria-label="Choose review">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Review ${i + 1} of ${n}`}
                onClick={() => setIndex(i)}
                className={[
                  'h-2 rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-gold' : 'w-2 bg-sand/30 hover:bg-sand/60',
                ].join(' ')}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next review"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand/25 text-sand transition-colors hover:border-gold hover:text-gold"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <div aria-live="polite" className="sr-only">
        Review {index + 1} of {n}
      </div>
    </div>
  );
}
