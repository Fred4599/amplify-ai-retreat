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
      <motion.div
        {...inView(hydrated, { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, { duration: 0.8 })}
        className="liquid-glass rounded-3xl p-6 sm:p-10 md:p-16 w-full backdrop-blur-xl border border-white/5"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center space-y-2">
              <span className="text-3xl md:text-4xl lg:text-5xl font-heading italic text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-white/60 font-body font-light text-sm tracking-wide uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
