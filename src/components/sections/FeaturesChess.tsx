import { motion } from 'motion/react';
import ApplyTrigger from '../ApplyTrigger';
import BlurText from '../BlurText';
import LazyVideo from '../LazyVideo';
import { MEDIA } from '../../config/media';
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
    <section id="experience" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 flex flex-col gap-16 sm:gap-24 md:gap-32 overflow-x-hidden">
      <div className="flex flex-col items-center text-center mb-4 sm:mb-8">
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
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading italic tracking-tight justify-center text-white px-2"
        />
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
        <motion.div
          {...inView(hydrated, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, { duration: 0.8 })}
          className="flex-1 space-y-5 sm:space-y-6 w-full max-w-full"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading italic text-white tracking-tight">
            Build with AI during the day.
          </h3>
          <p className="text-white/60 font-body font-light text-base sm:text-lg leading-relaxed max-w-md">
            Working sessions, masterminds, and real-time problem solving. Identify what's broken,
            workshop solutions in the room, and leave with a prototype, workflow, or implementation
            direction—not slides and theory.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 sm:pt-2">
            {tags.map((tag) => (
              <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-xs text-white/80 font-body">
                {tag}
              </span>
            ))}
          </div>
          <a
            href="#guides"
            className="liquid-glass-strong hover:bg-white/5 transition-colors rounded-full px-6 py-3 text-white font-medium text-sm mt-2 sm:mt-4 inline-flex items-center justify-center min-h-[44px]"
          >
            Meet Your Guides
          </a>
        </motion.div>

        <motion.div
          {...inView(hydrated, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, { duration: 0.8 })}
          className="flex-1 w-full max-w-full"
        >
          <div className="liquid-glass rounded-2xl p-2 w-full aspect-video md:aspect-[4/3] overflow-hidden group">
            <LazyVideo
              src={MEDIA.videos.featureDay}
              poster={MEDIA.posters.featureDay}
              playbackRate={0.5}
              className="w-full h-full object-cover rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              wrapperClassName="w-full h-full"
            />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row-reverse items-center gap-8 sm:gap-12 lg:gap-20">
        <motion.div
          {...inView(hydrated, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, { duration: 0.8 })}
          className="flex-1 space-y-5 sm:space-y-6 lg:pl-10 w-full max-w-full"
        >
          <div className="liquid-glass rounded-full px-3 py-1 inline-flex w-fit">
            <span className="text-white/80 text-[10px] font-medium font-body uppercase tracking-widest">
              Beyond the Classroom
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading italic text-white tracking-tight">
            Connect as humans in the evening.
          </h3>
          <p className="text-white/60 font-body font-light text-base sm:text-lg leading-relaxed max-w-md">
            River floating, zip lining, fire walks, dinners, and outdoor experiences designed for
            relationship-building. High-touch, energizing, and relational—not chairs all day.
          </p>
          <ApplyTrigger className="liquid-glass-strong hover:bg-white/5 transition-colors rounded-full px-6 py-3 text-white font-medium text-sm mt-2 sm:mt-4 inline-flex items-center justify-center min-h-[44px]">
            Apply to Attend
          </ApplyTrigger>
        </motion.div>

        <motion.div
          {...inView(hydrated, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, { duration: 0.8 })}
          className="flex-1 w-full max-w-full"
        >
          <div className="liquid-glass rounded-2xl p-2 w-full aspect-video md:aspect-[4/3] overflow-hidden group">
            <LazyVideo
              src={MEDIA.videos.featureEvening}
              poster={MEDIA.posters.featureEvening}
              playbackRate={0.5}
              className="w-full h-full object-cover rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              wrapperClassName="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
