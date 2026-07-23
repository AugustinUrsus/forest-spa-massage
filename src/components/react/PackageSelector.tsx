import { useState } from 'react';
import {
  Check,
  CalendarHeart,
  Sparkles,
  Flame,
  Droplets,
  Waves,
  Activity,
  CircleDot,
  type LucideIcon,
} from 'lucide-react';

interface Tier {
  tier: string;
  price: number;
  value: number | null;
  duration: string | null;
  inclusions: string[];
  href: string;
}
interface Pkg {
  name: string;
  icon: string;
  blurb: string;
  tiers: Tier[];
}

const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Flame,
  Droplets,
  Waves,
  Activity,
  CircleDot,
};

function TierCard({ tier, pkgName }: { tier: Tier; pkgName: string }) {
  return (
    <div className="surface-card flex h-full flex-col p-7 sm:p-8">
      <p className="eyebrow text-bronze-deep">{tier.tier}</p>

      <div className="mt-4 flex items-baseline gap-2.5">
        <span className="text-3xl font-semibold text-bronze">${tier.price}</span>
        {tier.value != null && (
          <span className="text-lg text-ink-soft/60 line-through">${tier.value}</span>
        )}
      </div>
      {tier.duration && (
        <p className="mt-1.5 text-xs uppercase tracking-widest text-ink-soft/70">{tier.duration}</p>
      )}

      <div className="hair-rule my-6" aria-hidden="true" />

      <ul className="space-y-3">
        {tier.inclusions.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-ink-soft">
            <Check size={17} strokeWidth={1.8} className="mt-0.5 shrink-0 text-sage-deep" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <a
          href={tier.href}
          target="_blank"
          rel="noopener"
          data-book={`package:${pkgName} ${tier.tier}`}
          className="btn btn-primary w-full"
        >
          <CalendarHeart size={18} strokeWidth={1.7} /> Book {tier.tier}
        </a>
      </div>
    </div>
  );
}

function PackageBlock({ pkg, index }: { pkg: Pkg; index: number }) {
  const Icon = ICONS[pkg.icon] ?? Sparkles;
  const tiers = pkg.tiers;
  const single = tiers.length === 1;
  const [active, setActive] = useState(() => {
    const premier = tiers.findIndex((t) => /premier/i.test(t.tier));
    return premier >= 0 ? premier : Math.min(1, tiers.length - 1);
  });
  const cols = tiers.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <article>
      {index > 0 && <div className="hair-rule mb-16" aria-hidden="true" />}

      <div className="flex items-start gap-4 sm:gap-5">
        <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage-deep">
          <Icon size={26} strokeWidth={1.6} />
        </span>
        <div className="max-w-2xl">
          <h3 className="display-heading text-2xl">{pkg.name}</h3>
          <p className="mt-2 text-ink-soft">{pkg.blurb}</p>
        </div>
      </div>

      {/* Mobile: tier picker + one card */}
      <div className="mt-8 md:hidden">
        {!single && (
          <div
            role="tablist"
            aria-label={`${pkg.name} tiers`}
            className="mb-5 flex gap-1.5 rounded-full border border-black/10 bg-cloud/70 p-1.5"
          >
            {tiers.map((t, i) => (
              <button
                key={t.tier}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={[
                  'flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300',
                  i === active ? 'bg-bronze text-cream shadow-sm' : 'text-ink-soft',
                ].join(' ')}
              >
                {t.tier}
              </button>
            ))}
          </div>
        )}
        <TierCard tier={tiers[active]} pkgName={pkg.name} />
      </div>

      {/* Desktop: all tiers side by side, equal height */}
      {single ? (
        <div className="mt-8 hidden md:block">
          <div className="mx-auto max-w-xl">
            <TierCard tier={tiers[0]} pkgName={pkg.name} />
          </div>
        </div>
      ) : (
        <div className={`mt-8 hidden gap-6 md:grid ${cols}`}>
          {tiers.map((t) => (
            <TierCard key={t.tier} tier={t} pkgName={pkg.name} />
          ))}
        </div>
      )}
    </article>
  );
}

export default function PackageSelector({ packages }: { packages: Pkg[] }) {
  return (
    <div className="space-y-16">
      {packages.map((pkg, i) => (
        <PackageBlock key={pkg.name} pkg={pkg} index={i} />
      ))}
    </div>
  );
}
