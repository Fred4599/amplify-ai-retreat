import { motion } from 'motion/react';
import {
  BookOpen,
  Clock,
  Coffee,
  Flame,
  Monitor,
  Users,
  Utensils,
  Waves,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import BlurText from '../BlurText';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';
import { WHATS_INCLUDED } from '../../content/retreat';

const includedIcons: LucideIcon[] = [
  Coffee,
  Monitor,
  Flame,
  Utensils,
  Waves,
  BookOpen,
  Users,
  Clock,
];

export default function WhatsIncluded() {
  const hydrated = useHydrated();

  return (
    <section
      id="included"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32"
    >
      <div className="flex flex-col items-center text-center mb-12 sm:mb-14">
        <motion.div
          {...inView(hydrated, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
          className="liquid-glass rounded-full px-4 py-1.5 mb-6"
        >
          <span className="text-white text-xs font-medium font-body uppercase tracking-wider">
            What&apos;s Included
          </span>
        </motion.div>

        <BlurText
          as="h2"
          text="Everything you need to focus."
          className="text-3xl sm:text-4xl md:text-5xl font-heading italic tracking-tight justify-center text-white px-2"
        />

        <motion.p
          {...inView(hydrated, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, { delay: 0.2, duration: 0.7 })}
          className="mt-4 text-white/60 font-body font-light text-base sm:text-lg max-w-xl leading-relaxed"
        >
          Meals, sessions, experiences, and expert support — so you can show up and build.
        </motion.p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {WHATS_INCLUDED.map((item, idx) => {
          const Icon = includedIcons[idx] ?? Coffee;
          return (
            <motion.div
              key={item}
              {...inView(
                hydrated,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0 },
                { delay: idx * 0.06, duration: 0.55 },
              )}
              className="liquid-glass rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center gap-2.5"
            >
              <Icon className="w-5 h-5 text-white/55" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-body font-light text-white/75 leading-snug">
                {item}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
