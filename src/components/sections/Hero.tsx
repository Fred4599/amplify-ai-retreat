import { motion } from 'motion/react';
import { ArrowUpRight, MapPin, Play } from 'lucide-react';
import { VENUE, venueAddressLine } from '../../config/site';
import ApplyTrigger from '../ApplyTrigger';
import BlurText from '../BlurText';
import { useHydrated } from '../useHydrated';
import { onMount } from '../motionPresets';

const guides = [
  { name: 'Braydon Carter', icon: 'solar:cpu-bolt-bold-duotone' },
  { name: 'Tony Child', icon: 'solar:heart-shine-bold-duotone' },
  { name: 'Bill Banta', icon: 'solar:chart-2-bold-duotone' },
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
    <section className="relative overflow-visible w-full" style={{ height: '1000px' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        poster="https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_002227_85b4b9bf-5754-49f2-8e95-a6cefa33b080.png"
        className="absolute left-0 w-full h-full object-cover z-0"
        style={{ top: '0%' }}
        onPlaying={(e) => e.currentTarget.removeAttribute('poster')}
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_002442_87557cfb-5754-46a7-ba3c-67e47a4df16a.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-b from-transparent to-black z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 h-full" style={{ paddingTop: '150px' }}>
        <motion.div
          {...fade(0.2)}
          className="liquid-glass rounded-full px-1 py-1 pr-4 flex items-center gap-3 mb-8"
        >
          <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            50 Seats Only
          </span>
          <span className="text-white/80 font-body text-sm font-medium">
            3-Day Implementation Retreat
          </span>
        </motion.div>

        <BlurText
          as="h1"
          text="Three days. One breakthrough."
          className="text-6xl md:text-7xl lg:text-[7.5rem] font-heading italic text-white leading-[0.85] max-w-4xl tracking-tight justify-center"
          delay={0.1}
          stagger={0.12}
          animateOnMount
        />

        <motion.p
          {...fade(0.8, true)}
          className="mt-8 text-lg md:text-xl text-white/85 font-body font-light leading-relaxed max-w-2xl"
        >
          Bring your biggest business bottleneck. Leave with a real AI-powered path forward.
        </motion.p>

        <motion.a
          {...fade(0.95, true)}
          href={VENUE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm text-white/90 hover:text-white font-body font-light transition-colors"
        >
          <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>
            {VENUE.name} · {venueAddressLine()}
          </span>
        </motion.a>

        <motion.div
          {...fade(1.1, true)}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10"
        >
          <ApplyTrigger className="liquid-glass-strong hover:scale-105 transition-transform duration-300 rounded-full px-6 py-3.5 flex items-center gap-2 text-white font-medium text-sm">
            Apply to Attend
            <ArrowUpRight className="w-4 h-4 opacity-70" />
          </ApplyTrigger>
          <a
            href="#experience"
            className="rounded-full px-6 py-3.5 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            See the Experience
          </a>
        </motion.div>

        <div className="mt-auto pb-12 pt-16 flex flex-col items-center w-full">
          <motion.div
            {...onMount(hydrated, { opacity: 0 }, { opacity: 1 }, { delay: 1.5, duration: 1 })}
            className="liquid-glass rounded-full px-4 py-1.5 mb-8"
          >
            <span className="text-white/50 text-xs font-body uppercase tracking-widest">
              Your Guides
            </span>
          </motion.div>

          <motion.div
            {...onMount(hydrated, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { delay: 1.6, duration: 1 })}
            className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-80"
          >
            {guides.map((guide) => (
              <div
                key={guide.name}
                className="flex items-center gap-3 text-2xl md:text-3xl font-heading italic text-white hover:opacity-100 hover:scale-105 transition-all cursor-default"
              >
                <iconify-icon icon={guide.icon} width="28" className="opacity-80" />
                {guide.name}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
