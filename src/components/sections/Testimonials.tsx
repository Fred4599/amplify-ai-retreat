import { motion } from 'motion/react';
import BlurText from '../BlurText';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';

const guides = [
  {
    icon: 'solar:cpu-bolt-bold-duotone',
    role: 'AI Strategist & Builder',
    name: 'Braydon Carter',
    body: 'Simplifies complex AI into clear business solutions. Helps you identify the right tool, system, or workflow for your specific problem—and leave with real next steps.',
  },
  {
    icon: 'solar:heart-shine-bold-duotone',
    role: 'Mindset & Transformation',
    name: 'Tony Child',
    body: 'Helps you understand resistance to change and connect purpose, vision, and identity to implementation. Moves you from fear and uncertainty to possibility and action.',
  },
  {
    icon: 'solar:chart-2-bold-duotone',
    role: 'Sales & Event Strategy',
    name: 'Bill Banta',
    body: 'Frames the commercial opportunity, positions solutions clearly, and connects the retreat experience to long-term business value.',
  },
];

export default function Testimonials() {
  const hydrated = useHydrated();

  return (
    <section id="guides" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          {...inView(hydrated, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
          className="liquid-glass rounded-full px-4 py-1.5 mb-6"
        >
          <span className="text-white text-xs font-medium font-body uppercase tracking-wider">
            Meet Your Guides
          </span>
        </motion.div>

        <BlurText
          as="h2"
          text="Implementation. Mindset. Strategy."
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic tracking-tight leading-[0.9] justify-center text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((item, idx) => (
          <motion.div
            key={item.name}
            {...inView(
              hydrated,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0 },
              { delay: idx * 0.15, duration: 0.6 },
            )}
            className="liquid-glass rounded-2xl p-8 flex flex-col justify-between h-full"
          >
            <div className="mb-8">
              <div className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <iconify-icon icon={item.icon} width="22" className="text-white/90" />
              </div>
              <div className="text-white/50 text-[10px] uppercase tracking-widest font-body mb-3">
                {item.role}
              </div>
              <h4 className="text-2xl font-heading italic tracking-tight text-white mb-4 leading-tight">
                {item.name}
              </h4>
              <p className="text-white/70 font-body font-light text-base leading-relaxed">{item.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
