import { useEffect, useRef, useState } from 'react';

export interface Slide {
  src: string;
  srcset: string;
  alt: string;
}

interface Props {
  slides: Slide[];
  /** Accessible name for the carousel group. */
  label: string;
  /** Auto-advance delay in ms. */
  intervalMs?: number;
  /** Tailwind aspect-ratio class controlling the frame the photos are cropped to. */
  aspectClass?: string;
  /** `sizes` attribute matching the column the carousel sits in. */
  sizes?: string;
  /** Extra object-position tuning (e.g. 'object-center' or 'object-[60%_center]'). */
  objectClass?: string;
}

/**
 * Crossfading image carousel. Images are stacked and fade between one another on
 * an auto-advancing timer (paused on hover/focus, disabled under
 * prefers-reduced-motion). Dots let guests jump to any slide.
 */
export default function ImageCarousel({
  slides,
  label,
  intervalMs = 2000,
  aspectClass = 'aspect-[4/3]',
  sizes = '(min-width:1024px) 50vw, 100vw',
  objectClass = 'object-center',
}: Props) {
  const [index, setIndex] = useState(0);
  const n = slides.length;
  const paused = useRef(false);

  useEffect(() => {
    if (n <= 1) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((p) => (p + 1) % n);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [n, intervalMs]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[var(--radius-card)] shadow-xl ${aspectClass}`}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      {slides.map((s, i) => (
        <img
          key={i}
          src={s.src}
          srcSet={s.srcset}
          sizes={sizes}
          alt={s.alt}
          loading={i === 0 ? 'eager' : 'lazy'}
          className={[
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]',
            objectClass,
            i === index ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          aria-hidden={i === index ? undefined : true}
        />
      ))}

      {n > 1 && (
        <div
          className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2.5"
          role="tablist"
          aria-label="Choose image"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Image ${i + 1} of ${n}`}
              onClick={() => setIndex(i)}
              className={[
                'h-2 rounded-full shadow-sm ring-1 ring-black/10 transition-all duration-300',
                i === index ? 'w-6 bg-white' : 'w-2 bg-white/55 hover:bg-white/80',
              ].join(' ')}
            />
          ))}
        </div>
      )}

      <div aria-live="polite" className="sr-only">
        Image {index + 1} of {n}
      </div>
    </div>
  );
}
