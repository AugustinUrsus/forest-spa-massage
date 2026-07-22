import { useCallback, useId, useRef, useState } from 'react';
import {
  Droplets,
  Waves,
  HeartHandshake,
  Activity,
  Leaf,
  Wind,
  Dumbbell,
  Baby,
  Footprints,
  Flower2,
  CircleDot,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceCategory } from '../../data/siteData';

const ICONS: Record<string, LucideIcon> = {
  Droplets,
  Waves,
  HeartHandshake,
  Activity,
  Leaf,
  Wind,
  Dumbbell,
  Baby,
  Footprints,
  Flower2,
  CircleDot,
};

interface Props {
  categories: ServiceCategory[];
  /** Fresha services URL used by every "Book this service" button. */
  bookUrl: string;
}

export default function ServiceTabs({ categories, bookUrl }: Props) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = (active + dir + categories.length) % categories.length;
      setActive(next);
      tabRefs.current[next]?.focus();
    },
    [active, categories.length],
  );

  const category = categories[active];

  return (
    <div>
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Service categories"
        onKeyDown={onKeyDown}
        className="mx-auto mb-12 flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-full border border-black/10 bg-cloud/70 p-1.5 backdrop-blur-sm sm:gap-1"
      >
        {categories.map((cat, i) => {
          const selected = i === active;
          return (
            <button
              key={cat.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={[
                'rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300 sm:px-6',
                selected
                  ? 'bg-bronze text-cream shadow-sm'
                  : 'text-ink-soft hover:text-bronze',
              ].join(' ')}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div
        key={category.id}
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${active}`}
        style={{ animation: 'reveal-in 0.5s var(--ease-out-soft) both' }}
      >
        <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-ink-soft">
          {category.blurb}
        </p>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.services.map((s) => {
            const Icon = ICONS[s.icon] ?? Leaf;
            return (
              <li
                key={s.name}
                className="surface-card group flex flex-col p-7 transition-transform duration-500 hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage-deep transition-colors duration-500 group-hover:bg-bronze/10 group-hover:text-bronze"
                >
                  <Icon size={24} strokeWidth={1.6} />
                </span>
                <h3 className="display-heading mb-2.5 text-xl font-semibold">{s.name}</h3>
                <p className="mb-6 flex-1 leading-relaxed text-ink-soft">{s.description}</p>
                <a
                  href={s.bookUrl ?? bookUrl}
                  target="_blank"
                  rel="noopener"
                  data-book={`service:${s.name}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-bronze transition-colors hover:text-bronze-deep"
                >
                  Book this service
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
