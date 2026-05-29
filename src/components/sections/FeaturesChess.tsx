import { motion } from 'motion/react';
import ApplyTrigger from '../ApplyTrigger';
import BlurText from '../BlurText';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';

const tags = [
  'Working Sessions',
  'Masterminds',
  'Problem Solving',
  'Implementation',
  'AI Systems',
  'Workflow Design',
];

export default function FeaturesChess() {
  const hydrated = useHydrated();

  return (
    <section id="experience" className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col gap-24 md:gap-32">
      <div className="flex flex-col items-center text-center mb-8">
        <motion.div
          {...inView(hydrated, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
          className="liquid-glass rounded-full px-4 py-1.5 mb-6"
        >
          <span className="text-white text-xs font-medium font-body uppercase tracking-wider">
            Why This Is Different
          </span>
        </motion.div>

        <BlurText
          as="h2"
          text="We don't just talk about AI. We help you apply it."
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic tracking-tight leading-[0.9] justify-center text-white"
        />
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <motion.div
          {...inView(hydrated, { opacity: 0, x: -50 }, { opacity: 1, x: 0 }, { duration: 0.8 })}
          className="flex-1 space-y-6"
        >
          <h3 className="text-3xl md:text-4xl font-heading italic text-white tracking-tight leading-tight">
            Build with AI during the day.
          </h3>
          <p className="text-white/60 font-body font-light text-lg leading-relaxed max-w-md">
            Working sessions, masterminds, and real-time problem solving. Identify what's broken,
            workshop solutions in the room, and leave with a prototype, workflow, or implementation
            direction—not slides and theory.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-xs text-white/80 font-body">
                {tag}
              </span>
            ))}
          </div>
          <a
            href="#guides"
            className="liquid-glass-strong hover:bg-white/5 transition-colors rounded-full px-6 py-3 text-white font-medium text-sm mt-4 inline-block"
          >
            Meet Your Guides
          </a>
        </motion.div>

        <motion.div
          {...inView(hydrated, { opacity: 0, x: 50 }, { opacity: 1, x: 0 }, { duration: 0.8 })}
          className="flex-1 w-full"
        >
          <div className="liquid-glass rounded-2xl p-2 w-full aspect-video md:aspect-[4/3] overflow-hidden group">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_003518_32bbdbf6-d08a-49fb-b464-f43bdbdbb2a9.png"
              onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 0.5; }}
              className="w-full h-full object-cover rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_004011_5e1621a5-0a95-4f9b-8cac-46d96bb4d997.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
        <motion.div
          {...inView(hydrated, { opacity: 0, x: 50 }, { opacity: 1, x: 0 }, { duration: 0.8 })}
          className="flex-1 space-y-6 lg:pl-10"
        >
          <div className="liquid-glass rounded-full px-3 py-1 inline-flex w-fit">
            <span className="text-white/80 text-[10px] font-medium font-body uppercase tracking-widest">
              Beyond the Classroom
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-heading italic text-white tracking-tight leading-tight">
            Connect as humans in the evening.
          </h3>
          <p className="text-white/60 font-body font-light text-lg leading-relaxed max-w-md">
            River floating, zip lining, fire walks, dinners, and outdoor experiences designed for
            relationship-building. High-touch, energizing, and relational—not chairs all day.
          </p>
          <ApplyTrigger className="liquid-glass-strong hover:bg-white/5 transition-colors rounded-full px-6 py-3 text-white font-medium text-sm mt-4 inline-block">
            Apply to Attend
          </ApplyTrigger>
        </motion.div>

        <motion.div
          {...inView(hydrated, { opacity: 0, x: -50 }, { opacity: 1, x: 0 }, { duration: 0.8 })}
          className="flex-1 w-full"
        >
          <div className="liquid-glass rounded-2xl p-2 w-full aspect-video md:aspect-[4/3] overflow-hidden group">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_004323_78fc6a4e-0fcd-44e7-aa80-b1ddbb970fdd.png"
              onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 0.5; }}
              className="w-full h-full object-cover rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_004522_dd9e568e-ee7f-45c7-9499-2b7bcd2e41aa.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
