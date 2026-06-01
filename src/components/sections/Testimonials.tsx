import { motion } from 'motion/react';
import { BarChart2, Cpu, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import BlurText from '../BlurText';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';

const guides: { Icon: LucideIcon; photo?: string; role: string; name: string; body: string }[] = [
  {
    Icon: Cpu,
    photo: '/media/guide-braydon-carter.webp',
    role: 'AI Strategist & Builder',
    name: 'Braydon Carter',
    body: 'Simplifies complex AI into clear business solutions. Helps you identify the right tool, system, or workflow for your specific problem—and leave with real next steps.',
  },
  {
    Icon: Heart,
    photo: '/media/guide-tony-child.webp',
    role: 'Mindset & Transformation',
    name: 'Tony Child',
    body: 'Helps you understand resistance to change and connect purpose, vision, and identity to implementation. Moves you from fear and uncertainty to possibility and action.',
  },
  {
    Icon: BarChart2,
    photo: '/media/guide-bill-banta.webp',
    role: 'Coaching & Strategy',
    name: 'Bill Banta',
    body: 'Coaches you on priorities, positioning, and the decisions that turn an AI breakthrough into a plan you can actually run. Helps align mindset and strategy so implementation sticks in your business—not just at the retreat.',
  },
];

export default function Testimonials() {
  const hydrated = useHydrated();

  return (
    <section id="guides" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          {...inView(hydrated, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
          className="liquid-glass rounded-full px-5 py-2 mb-6"
        >
          <span className="text-white text-sm font-medium font-body uppercase tracking-wider">
            Meet Your Guides
          </span>
        </motion.div>

        <BlurText
          as="h2"
          text="Implementation. Mindset. Strategy."
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading italic tracking-tight justify-center text-white px-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map(({ Icon, photo, role, name, body }, idx) => (
          <motion.div
            key={name}
            {...inView(
              hydrated,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0 },
              { delay: idx * 0.15, duration: 0.6 },
            )}
            className="liquid-glass rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full"
          >
            <div className="mb-8">
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  loading="lazy"
                  width={128}
                  height={128}
                  className="liquid-glass-strong rounded-full w-28 h-28 sm:w-32 sm:h-32 object-cover mb-6"
                />
              ) : (
                <div className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Icon className="w-[22px] h-[22px] text-white/90" aria-hidden="true" />
                </div>
              )}
              <div className="text-white/50 text-[10px] uppercase tracking-widest font-body mb-3">
                {role}
              </div>
              <h4 className="text-2xl font-heading italic tracking-tight text-white mb-4">
                {name}
              </h4>
              <p className="text-white/70 font-body font-light text-base leading-relaxed">{body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
