import { ArrowUpRight } from 'lucide-react';
import ApplyTrigger from './ApplyTrigger';

const navItems = [
  { label: 'Experience', href: '#experience' },
  { label: 'Outcomes', href: '#outcomes' },
  { label: 'Guides', href: '#guides' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  return (
    <nav aria-label="Main navigation" className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16 py-3 flex items-center justify-between pointer-events-none">
      <a
        href="/"
        className="pointer-events-auto h-12 pl-2 pr-4 flex items-center justify-center gap-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10"
      >
        <img
          src="/logo.png"
          alt="Amplify AI"
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 object-contain"
        />
        <span className="text-white font-body font-medium text-sm tracking-tight">Amplify</span>
      </a>

      <div className="pointer-events-auto hidden md:flex items-center liquid-glass rounded-full px-1.5 py-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="px-4 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors"
          >
            {item.label}
          </a>
        ))}
        <ApplyTrigger className="px-4 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors">
          Apply
        </ApplyTrigger>
        <ApplyTrigger className="bg-white text-black hover:bg-white/90 transition-colors rounded-full px-3.5 py-1.5 text-sm font-medium flex items-center gap-1.5 ml-2">
          Apply
          <ArrowUpRight className="w-4 h-4" />
        </ApplyTrigger>
      </div>

      <div className="md:hidden pointer-events-auto liquid-glass rounded-full p-3 flex items-center justify-center">
        <iconify-icon icon="solar:hamburger-menu-linear" width="24" height="24" className="text-white" />
      </div>
    </nav>
  );
}
