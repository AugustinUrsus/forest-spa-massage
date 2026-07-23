import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Phone, CalendarHeart } from 'lucide-react';
import type { NavLink } from '../../data/siteData';

interface Props {
  links: NavLink[];
  bookUrl: string;
  phone: string;
  phoneHref: string;
}

export default function MobileNav({ links, bookUrl, phone, phoneHref }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // While open: lock scroll, trap Tab focus, and make the rest of the page inert.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const wrapper = wrapperRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('drawer-open');

    const deactivated = Array.from(document.body.children).filter(
      (el) => el !== wrapper && el.tagName !== 'SCRIPT',
    );
    deactivated.forEach((el) => el.setAttribute('inert', ''));

    const focusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          )
        : [];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    focusables()[0]?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('drawer-open');
      deactivated.forEach((el) => el.removeAttribute('inert'));
      document.removeEventListener('keydown', onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  const overlay = (
    <div ref={wrapperRef}>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={[
          'fixed inset-0 z-[60] bg-charcoal/70 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      {/* Drawer — opaque white panel above everything */}
      <div
        id="mobile-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        style={{ backgroundColor: 'var(--color-cloud)' }}
        className={[
          'fixed inset-y-0 right-0 z-[70] flex w-[85%] max-w-sm flex-col overflow-y-auto border-l border-black/10 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : 'pointer-events-none translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <span className="display-heading text-lg font-semibold uppercase tracking-[0.22em] text-ink">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5"
          >
            <X size={24} strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-3 py-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="display-heading rounded-2xl px-3 py-3.5 text-2xl font-semibold tracking-wide text-ink transition-colors hover:text-bronze"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 border-t border-black/10 p-6">
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener"
            data-book="mobile-drawer"
            onClick={() => setOpen(false)}
            className="btn btn-primary w-full"
          >
            <CalendarHeart size={18} /> Book Now
          </a>
          <a href={phoneHref} data-call="mobile-drawer" className="btn btn-outline w-full">
            <Phone size={17} /> {phone}
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5"
      >
        <Menu size={24} strokeWidth={1.75} />
      </button>

      {mounted && createPortal(overlay, document.body)}
    </div>
  );
}
