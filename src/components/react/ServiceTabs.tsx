import { useCallback, useId, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Sparkles, BookOpen } from 'lucide-react';

interface Item {
  name: string;
  id: string;
  priceLabel: string;
  inSessionPrice?: string | null;
  duration: string | null;
  description: string;
  href: string;
  highlights?: string[];
  idealFor?: string;
  whatToExpect?: string;
  articleUrl?: string;
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggleExpand = (name: string) => {
    setExpanded((prev) => {
      const nextState = !prev[name];
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'service_detail_toggle',
          service_name: name,
          is_expanded: nextState,
        });
      }
      return { ...prev, [name]: nextState };
    });
  };

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next = active;
      if (e.key === 'ArrowRight') {
        next = (active + 1) % categories.length;
      } else if (e.key === 'ArrowLeft') {
        next = (active - 1 + categories.length) % categories.length;
      } else if (e.key === 'Home') {
        next = 0;
      } else if (e.key === 'End') {
        next = categories.length - 1;
      } else {
        return;
      }
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    },
    [active, categories.length],
  );

  const category = categories[active];

  return (
    <div>
      {/* Category selector tablist with safe top offset below the sticky header */}
      <div className="sticky top-18 z-20 mb-8 flex justify-center lg:static lg:top-auto">
        <div className="max-w-full overflow-x-auto no-scrollbar px-2 py-1">
          <div
            role="tablist"
            aria-label="Service categories"
            onKeyDown={onKeyDown}
            className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-cloud/95 p-1.5 shadow-md shadow-charcoal/5 backdrop-blur-md"
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
                    'cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 sm:px-7',
                    selected
                      ? 'bg-bronze text-cream shadow-sm'
                      : 'text-ink-soft hover:text-bronze hover:bg-black/5',
                  ].join(' ')}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        key={category.id}
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${active}`}
        style={{ animation: 'reveal-in 0.4s var(--ease-out-soft) both' }}
      >
        <p className="mx-auto mb-10 max-w-2xl text-center text-base sm:text-lg text-ink-soft">
          {category.blurb}
        </p>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {category.services.map((s) => {
            const isExpanded = !!expanded[s.name];
            const detailsId = `${uid}-details-${s.id.replace(/[^a-zA-Z0-9_-]/g, '')}`;

            return (
              <li
                key={s.name}
                className="surface-card group flex h-full flex-col p-6 transition-all duration-300 hover:border-bronze/40 hover:shadow-lg"
              >
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h3 className="display-heading text-lg font-semibold leading-tight text-ink">
                    {s.name}
                  </h3>
                  <span className="shrink-0 font-semibold text-bronze">
                    {s.inSessionPrice ?? s.priceLabel}
                  </span>
                </div>

                {s.inSessionPrice ? (
                  <p className="mb-3 text-xs leading-relaxed text-ink-soft/70">
                    <span className="block font-medium text-sage-deep">Added to a massage</span>
                    <span className="block">
                      or {s.priceLabel}
                      {s.duration ? ` for ${s.duration}` : ''} on its own
                    </span>
                  </p>
                ) : (
                  s.duration && (
                    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft/70">
                      {s.duration}
                    </p>
                  )
                )}

                <p className="mb-4 text-sm leading-relaxed text-ink-soft">{s.description}</p>

                {/* Expandable detailed drawer with zero-CLS CSS Grid transition */}
                {(s.highlights || s.whatToExpect || s.idealFor || s.articleUrl) && (
                  <div className="mt-auto border-t border-black/5 pt-3">
                    <button
                      type="button"
                      onClick={() => toggleExpand(s.name)}
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      aria-label={`${isExpanded ? 'Hide' : 'View'} details, benefits, and guide for ${s.name}`}
                      className="group/toggle flex w-full cursor-pointer items-center justify-between text-xs font-semibold tracking-wide text-bronze transition-colors hover:text-bronze-deep"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles size={13} className="text-sage" />
                        {isExpanded ? 'Hide Details' : 'Details & Highlights'}
                      </span>
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-300 ${
                          isExpanded
                            ? 'rotate-180 text-bronze-deep'
                            : 'text-ink-soft/60 group-hover/toggle:translate-y-0.5'
                        }`}
                      />
                    </button>

                    <div
                      id={detailsId}
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isExpanded
                          ? 'grid-rows-[1fr] opacity-100 pt-3'
                          : 'grid-rows-[0fr] opacity-0 pt-0 pointer-events-none'
                      }`}
                    >
                      <div className="overflow-hidden space-y-3 text-xs text-ink-soft">
                        {s.highlights && s.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {s.highlights.map((h, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-full bg-sage/15 px-2.5 py-1 text-[11px] font-medium text-sage-deep"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}

                        {s.idealFor && (
                          <div className="rounded-lg bg-sand/40 p-2.5">
                            <span className="block font-semibold text-ink">Best For:</span>
                            <span className="mt-0.5 block leading-relaxed text-ink-soft">
                              {s.idealFor}
                            </span>
                          </div>
                        )}

                        {s.whatToExpect && (
                          <div className="leading-relaxed">
                            <span className="block font-semibold text-ink">What to Expect:</span>
                            <span className="mt-0.5 block text-ink-soft/90">{s.whatToExpect}</span>
                          </div>
                        )}

                        {s.articleUrl && (
                          <div className="pt-1">
                            <a
                              href={s.articleUrl}
                              className="inline-flex items-center gap-1.5 font-semibold text-bronze transition-colors hover:text-bronze-deep hover:underline"
                            >
                              <BookOpen size={13} className="shrink-0 text-sage" />
                              <span>Read related wellness guide →</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex justify-end pt-2">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    data-book={`service:${s.name}`}
                    aria-label={`Book ${s.name} at Forest Spa Poway`}
                    className="btn btn-primary"
                  >
                    Book
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
