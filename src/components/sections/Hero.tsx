import { motion } from 'motion/react';
import { ArrowUpRight, BarChart2, Cpu, Heart, MapPin, Play } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { VENUE, venueAddressLine } from '../../config/site';
import { MEDIA } from '../../config/media';
import ApplyTrigger from '../ApplyTrigger';
import BlurText from '../BlurText';
import LazyVideo from '../LazyVideo';
import { useHydrated } from '../useHydrated';
import { onMount } from '../motionPresets';

const guides: { name: string; Icon: LucideIcon }[] = [
  { name: 'Braydon Carter', Icon: Cpu },
  { name: 'Tony Child', Icon: Heart },
  { name: 'Bill Banta', Icon: BarChart2 },
];

export default function Hero() {
  const hydrated = useHydrated();

  const fade = (delay: number, blur = false) =>
    onMount(
      hydrated,
      blur
        ? { opacity: 0, y: 20, filter: 'blur(10px)' }
        : { opacity: 0, y: 20 },
      { opacity: 1, y: 0, filter: 'blur(0px)' },
      { delay, duration: 0.8 },
    );

  return (
    <section className="relative overflow-hidden w-full min-h-[100svh] max-h-[1100px] h-[min(100svh,1000px)]">
      <LazyVideo
        priority
        src={MEDIA.videos.hero}
        poster={MEDIA.posters.hero}
        wrapperClassName="absolute inset-0 z-0"
        className="absolute left-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[200px] sm:h-[300px] bg-gradient-to-b from-transparent to-black z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 h-full pt-24 sm:pt-28 md:pt-32 lg:pt-[150px]">
        <motion.div
          {...fade(0.2)}
          className="liquid-glass rounded-2xl sm:rounded-full px-3 py-2.5 sm:px-1 sm:py-1 sm:pr-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-6 sm:mb-8 w-auto max-w-[calc(100%-0.5rem)]"
        >
          <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0">
            50 Seats Only
          </span>
          <span className="text-white/80 font-body text-sm font-medium text-center sm:text-left leading-snug">
            3-Day Implementation Retreat
          </span>
        </motion.div>

        <BlurText
          as="h1"
          text="Three days. One breakthrough."
          className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[7.5rem] font-heading italic text-white leading-[0.9] max-w-4xl tracking-tight justify-center px-1"
          delay={0.1}
          stagger={0.12}
          animateOnMount
        />

        <motion.p
          {...fade(0.8, true)}
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-white/85 font-body font-light leading-relaxed max-w-2xl px-1"
        >
          Bring your biggest business bottleneck. Leave with a real AI-powered path forward.
        </motion.p>

        <motion.a
          {...fade(0.95, true)}
          href={VENUE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 sm:mt-5 inline-flex items-start sm:items-center gap-2 text-xs sm:text-sm text-white/90 hover:text-white font-body font-light transition-colors text-center max-w-md px-2"
        >
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <span>
            {VENUE.name} · {venueAddressLine()}
          </span>
        </motion.a>

        <motion.div
          {...fade(1.1, true)}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto max-w-sm sm:max-w-none px-2 sm:px-0"
        >
          <ApplyTrigger className="liquid-glass-strong hover:scale-105 transition-transform duration-300 rounded-full px-6 py-3.5 flex items-center justify-center gap-2 text-white font-medium text-sm min-h-[44px]">
            Apply to Attend
            <ArrowUpRight className="w-4 h-4 opacity-70" />
          </ApplyTrigger>
          <a
            href="#experience"
            className="rounded-full px-6 py-3.5 flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors font-medium text-sm min-h-[44px]"
          >
            <Play className="w-4 h-4 fill-current" />
            See the Experience
          </a>
        </motion.div>

        <div className="mt-auto pb-8 sm:pb-12 pt-10 sm:pt-16 flex flex-col items-center w-full">
          <motion.div
            {...onMount(hydrated, { opacity: 0 }, { opacity: 1 }, { delay: 1.5, duration: 1 })}
            className="liquid-glass rounded-full px-4 py-1.5 mb-6 sm:mb-8"
          >
            <span className="text-white/50 text-xs font-body uppercase tracking-widest">
              Your Guides
            </span>
          </motion.div>

          <motion.div
            {...onMount(hydrated, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { delay: 1.6, duration: 1 })}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 md:gap-16 opacity-80 w-full px-2"
          >
            {guides.map(({ name, Icon }) => (
              <div
                key={name}
                className="flex items-center justify-center gap-2 sm:gap-3 text-xl sm:text-2xl md:text-3xl font-heading italic text-white"
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 opacity-80 shrink-0" aria-hidden="true" />
                {name}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
