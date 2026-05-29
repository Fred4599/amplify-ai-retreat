import { motion } from 'motion/react';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';

const stats = [
  { value: 'Clarity', label: 'On your biggest bottleneck' },
  { value: 'Direction', label: 'AI solution path for your business' },
  { value: 'Momentum', label: 'Implementation plan you can act on' },
  { value: 'Connection', label: 'Relationships with entrepreneurs in the room' },
];

export default function Stats() {
  const hydrated = useHydrated();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            {...inView(
              hydrated,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0 },
              { delay: idx * 0.08, duration: 0.6 },
            )}
            className="liquid-glass rounded-2xl p-6 sm:p-8 text-center backdrop-blur-xl border border-white/5"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-heading italic text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-white/60 font-body font-light text-xs sm:text-sm tracking-wide uppercase leading-snug max-w-[14rem] mx-auto">
                {stat.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
