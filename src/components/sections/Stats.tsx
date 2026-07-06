import { motion } from 'motion/react';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';
import { RETREAT_OUTCOMES } from '../../content/retreat';

export default function Stats() {
  const hydrated = useHydrated();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
        <motion.p
          {...inView(hydrated, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, { duration: 0.6 })}
          className="text-white/50 font-body font-light text-sm sm:text-base uppercase tracking-widest"
        >
          What you&apos;ll walk away with
        </motion.p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {RETREAT_OUTCOMES.map((stat, idx) => (
          <motion.div
            key={stat.label}
            {...inView(
              hydrated,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0 },
              { delay: idx * 0.08, duration: 0.6 },
            )}
            className="liquid-glass rounded-2xl p-5 sm:p-6 md:p-7 text-center backdrop-blur-xl border border-white/5"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl md:text-3xl font-heading italic text-white tracking-tight leading-tight">
                {stat.value}
              </span>
              <span className="text-white/60 font-body font-light text-[10px] sm:text-xs tracking-wide uppercase leading-snug max-w-[12rem] mx-auto">
                {stat.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
