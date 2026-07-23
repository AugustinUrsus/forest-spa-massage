import { useCallback, useId, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Item {
  name: string;
  priceLabel: string;
  duration: string | null;
  description: string;
  href: string;
}
interface Category {
  id: string;
  label: string;
  blurb: string;
  services: Item[];
}

interface Props {
  categories: Category[];
}

export default function ServiceTabs({ categories }: Props) {
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
      <div className="mb-12 flex justify-center">
        <div
          role="tablist"
          aria-label="Service categories"
          onKeyDown={onKeyDown}
          className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border border-black/10 bg-cloud/70 p-1.5 backdrop-blur-sm"
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
                  'rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300 sm:px-7',
                  selected ? 'bg-bronze text-cream shadow-sm' : 'text-ink-soft hover:text-bronze',
                ].join(' ')}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={category.id}
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${active}`}
        style={{ animation: 'reveal-in 0.5s var(--ease-out-soft) both' }}
      >
        <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-ink-soft">{category.blurb}</p>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {category.services.map((s) => (
            <li className="surface-card group flex flex-col p-6">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h3 className="display-heading text-lg font-semibold leading-tight">{s.name}</h3>
                <span className="shrink-0 font-semibold text-bronze">{s.priceLabel}</span>
              </div>
              {s.duration && (
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft/70">
                  {s.duration}
                </p>
              )}
              <p className="mb-6 flex-1 text-sm leading-relaxed text-ink-soft">{s.description}</p>
              <a
                href={s.href}
                target="_blank"
                rel="noopener"
                data-book={`service:${s.name}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-bronze transition-colors hover:text-bronze-deep"
              >
                Book
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
