import { ArrowUpRight, Play } from 'lucide-react';
import { eventDatesLine, PRESENTER } from '../../config/site';
import { MEDIA } from '../../config/media';
import ApplyTrigger from '../ApplyTrigger';
import LazyVideo from '../LazyVideo';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100svh] h-auto sm:h-[min(100svh,1000px)] sm:max-h-[1100px] overflow-x-hidden">
      <LazyVideo
        priority
        src={MEDIA.videos.hero}
        poster={MEDIA.posters.hero}
        wrapperClassName="absolute inset-0 z-0 w-full h-full"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[200px] sm:h-[300px] bg-gradient-to-b from-transparent to-black z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 h-full min-h-[100svh] w-full max-w-full overflow-x-hidden pt-24 sm:pt-28 md:pt-32 lg:pt-[150px] pb-6 sm:pb-0">
        <div
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full px-2 sm:px-1 sm:py-1 sm:pr-4 sm:liquid-glass sm:rounded-full"
        >
          <span className="bg-white text-black rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0">
            50 Seats Only
          </span>
          <span className="text-white/85 font-body text-sm font-medium text-center sm:text-left leading-snug max-w-[18rem] sm:max-w-none">
            {eventDatesLine()} · 3-Day Implementation Retreat
          </span>
        </div>

        <h1 className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[7.5rem] font-heading italic text-white max-w-5xl tracking-tight text-center px-1 leading-[1.05]">
          AI Amplify Retreat
        </h1>

        <p className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-sm sm:text-base text-white/70 font-body font-medium tracking-wide">
          <span>Presented by</span>
          <img
            src={PRESENTER.logoPath}
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 object-contain opacity-95"
            decoding="async"
            aria-hidden
          />
          <span>{PRESENTER.name}</span>
        </p>

        <h2 className="mt-5 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.75rem] text-white/90 font-heading italic tracking-tight text-center max-w-4xl leading-[1.08]">
          Three Days, One Breakthrough
        </h2>

        <p
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-white/85 font-body font-light leading-relaxed max-w-2xl px-1 text-center"
        >
          Bring your biggest business bottleneck. Leave with a real AI-powered path forward.
        </p>

        <div
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
        </div>
      </div>
    </section>
  );
}
