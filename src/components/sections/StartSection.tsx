import { motion } from 'motion/react';
import BlurText from '../BlurText';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';

export default function StartSection() {
  const hydrated = useHydrated();

  return (
    <div className="flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto">
      <motion.div
        {...inView(hydrated, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
        className="liquid-glass rounded-full px-4 py-1.5 mb-8"
      >
        <span className="text-white text-xs font-medium font-body uppercase tracking-wider">
          What This Is
        </span>
      </motion.div>

      <BlurText
        as="h2"
        text="Not another AI conference."
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading italic tracking-tight justify-center text-white mb-6 px-1"
      />

      <motion.p
        {...inView(hydrated, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { delay: 0.4, duration: 0.8 })}
        className="text-white/60 font-body font-light text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 px-1"
      >
        This is a 3-day immersive implementation retreat for business owners and entrepreneurs. We don't
        teach AI theory — we help you solve real business problems using AI, mindset, and human connection.
        Practical AI + strategic thinking + high-value relationships.
      </motion.p>

      <motion.a
        href="#schedule"
        {...inView(hydrated, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { delay: 0.6, duration: 0.8 })}
        className="liquid-glass-strong hover:scale-105 transition-transform duration-300 rounded-full px-8 py-4 text-white font-medium text-sm"
      >
        See Your Three Days
      </motion.a>
    </div>
  );
}
