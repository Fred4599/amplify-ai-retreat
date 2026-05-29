import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import ApplyTrigger from './ApplyTrigger';

const navItems = [
  { label: 'Experience', href: '#experience' },
  { label: 'Outcomes', href: '#outcomes' },
  { label: 'Guides', href: '#guides' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-16 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 flex items-center justify-between pointer-events-none"
      >
        <a
          href="/"
          className="pointer-events-auto h-11 sm:h-12 pl-2 pr-3 sm:pr-4 flex items-center justify-center gap-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 min-h-[44px]"
        >
          <img
            src="/logo.png"
            alt="Amplify AI"
            width={36}
            height={36}
            className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 object-contain"
            decoding="async"
          />
          <span className="text-white font-body font-medium text-sm tracking-tight">Amplify</span>
        </a>

        <div className="pointer-events-auto hidden md:flex items-center liquid-glass rounded-full px-1.5 py-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors min-h-[44px] flex items-center"
            >
              {item.label}
            </a>
          ))}
          <ApplyTrigger className="bg-white text-black hover:bg-white/90 transition-colors rounded-full px-3.5 py-1.5 text-sm font-medium flex items-center gap-1.5 ml-2 min-h-[36px]">
            Apply
            <ArrowUpRight className="w-4 h-4" />
          </ApplyTrigger>
        </div>

        <button
          type="button"
          className="md:hidden pointer-events-auto liquid-glass rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="w-6 h-6 text-white" aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6 text-white" aria-hidden="true" />
          )}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-40 md:hidden pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={close}
          />
          <div className="absolute top-[max(4.5rem,env(safe-area-inset-top))] left-4 right-4 liquid-glass-strong rounded-2xl p-4 flex flex-col gap-1 shadow-2xl">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={close}
                className="rounded-xl px-4 py-3.5 text-base font-medium text-white/90 font-body hover:bg-white/10 transition-colors min-h-[44px] flex items-center"
              >
                {item.label}
              </a>
            ))}
            <ApplyTrigger
              onClick={close}
              className="mt-2 bg-white text-black hover:bg-white/90 transition-colors rounded-full px-6 py-3.5 text-sm font-medium flex items-center justify-center gap-2 min-h-[44px]"
            >
              Apply to Attend
              <ArrowUpRight className="w-4 h-4" />
            </ApplyTrigger>
          </div>
        </div>
      )}
    </>
  );
}
