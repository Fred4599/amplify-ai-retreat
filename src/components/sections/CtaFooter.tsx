import { motion } from 'motion/react';
import ApplyTrigger from '../ApplyTrigger';
import BlurText from '../BlurText';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';
import { VENUE, venueAddressLine } from '../../config/site';

const steps = [
  {
    num: '01',
    title: 'Your Business',
    desc: "Share who you are, what you do, and where you're stuck.",
  },
  {
    num: '02',
    title: 'Your Problem',
    desc: 'Describe the bottleneck costing you time, money, energy, or growth.',
  },
  {
    num: '03',
    title: 'Your Goal',
    desc: 'Tell us what a successful AI breakthrough would look like for your business.',
  },
];

const footerLinks = [
  { label: 'Experience', href: '#experience' },
  { label: 'Guides', href: '#guides' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Apply', href: '/apply' },
];

export default function CtaFooter() {
  const hydrated = useHydrated();

  return (
    <>
      <div className="flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full mb-20 pt-32">
        <motion.div
          {...inView(hydrated, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
          className="liquid-glass rounded-full px-4 py-1.5 mb-6"
        >
          <span className="text-white text-xs font-medium font-body uppercase tracking-wider">
            Retreat Application
          </span>
        </motion.div>

        <BlurText
          as="h2"
          text="Apply to attend."
          className="text-5xl md:text-6xl lg:text-7xl font-heading italic tracking-tight leading-[0.85] justify-center text-white mb-6"
        />

        <motion.p
          {...inView(hydrated, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { delay: 0.4, duration: 0.8 })}
          className="text-white/60 font-body font-light text-lg mb-12 max-w-xl mx-auto"
        >
          This is a curated, high-touch experience capped at 50 seats. Tell us about your business and
          the problem you want to solve—we'll review every application personally.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              {...inView(
                hydrated,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0 },
                { delay: 0.5 + idx * 0.12, duration: 0.6 },
              )}
              className="liquid-glass rounded-2xl p-6 text-left"
            >
              <div className="text-white/40 text-xs font-body tracking-widest mb-3">STEP {step.num}</div>
              <h5 className="text-xl font-heading italic text-white mb-2 tracking-tight">{step.title}</h5>
              <p className="text-white/60 font-body font-light text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...inView(hydrated, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { delay: 0.9, duration: 0.8 })}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <ApplyTrigger className="bg-white text-black hover:bg-white/90 transition-colors duration-300 rounded-full px-8 py-3.5 font-medium text-sm w-full sm:w-auto inline-block text-center">
            Start Application
          </ApplyTrigger>
          <button
            type="button"
            className="liquid-glass-strong hover:scale-105 transition-transform duration-300 rounded-full px-8 py-3.5 text-white font-medium text-sm w-full sm:w-auto"
          >
            Speak With the Team
          </button>
        </motion.div>
      </div>

      <div className="relative z-10 w-full border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <p className="text-white/40 text-xs font-body font-light">
              © 2026 Amplify AI Retreat. Unlock human potential through AI.
            </p>
            <a
              href={VENUE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/70 text-xs font-body font-light transition-colors"
            >
              {venueAddressLine()}
            </a>
          </div>

          <div className="flex items-center gap-6">
            {footerLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/40 hover:text-white transition-colors text-xs font-body font-light"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
