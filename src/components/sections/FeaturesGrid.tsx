import { motion } from 'motion/react';
import BlurText from '../BlurText';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';

const pillars = [
  {
    icon: 'solar:case-round-bold-duotone',
    title: 'Business Owners',
    desc: "You know AI matters but haven't implemented it well yet. You're ready to stop researching and start solving.",
  },
  {
    icon: 'solar:rocket-2-bold-duotone',
    title: 'Founders & Entrepreneurs',
    desc: "You're bottlenecked and need clarity, not more hype. You want a real path forward, not another keynote.",
  },
  {
    icon: 'solar:settings-bold-duotone',
    title: 'Operators & Leaders',
    desc: 'Repetitive tasks, admin overload, and broken follow-up systems are costing you time, money, and growth.',
  },
  {
    icon: 'solar:star-bold-duotone',
    title: 'High Performers Ready to Act',
    desc: 'You value strategic thinking, implementation, and real connection over vendor pitches and tool demos.',
  },
];

export default function FeaturesGrid() {
  const hydrated = useHydrated();

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          {...inView(hydrated, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
          className="liquid-glass rounded-full px-4 py-1.5 mb-6"
        >
          <span className="text-white text-xs font-medium font-body uppercase tracking-wider">
            Who It's For
          </span>
        </motion.div>

        <BlurText
          as="h2"
          text="Built for operators, not spectators."
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic tracking-tight leading-[0.9] justify-center text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((feature, idx) => (
          <motion.div
            key={feature.title}
            {...inView(
              hydrated,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0 },
              { delay: idx * 0.1, duration: 0.6 },
            )}
            className="liquid-glass rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center mb-6">
              <iconify-icon icon={feature.icon} width="22" className="text-white/90" />
            </div>
            <h4 className="text-xl font-heading italic tracking-tight text-white mb-3">{feature.title}</h4>
            <p className="text-white/60 font-body font-light text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
