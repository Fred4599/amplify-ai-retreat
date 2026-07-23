import { motion } from 'motion/react';
import { Download, Moon, Sparkles, Sun, Sunset } from 'lucide-react';
import BlurText from '../BlurText';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';
import {
  AGENDA_DOWNLOADS,
  RETREAT_DAYS,
  WELCOME_RECEPTION,
} from '../../content/retreat';

const periodIcons: Record<string, typeof Sun> = {
  Morning: Sun,
  Afternoon: Sunset,
  Evening: Moon,
};

type AgendaDownloads = typeof AGENDA_DOWNLOADS;

interface RetreatScheduleProps {
  agendaDownloads?: Pick<AgendaDownloads, 'oneSheet' | 'full'>;
}

export default function RetreatSchedule({ agendaDownloads = AGENDA_DOWNLOADS }: RetreatScheduleProps) {
  const hydrated = useHydrated();

  return (
    <section
      id="schedule"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-x-hidden"
    >
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
        <motion.div
          {...inView(hydrated, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
          className="liquid-glass rounded-full px-4 py-1.5 mb-6"
        >
          <span className="text-white text-xs font-medium font-body uppercase tracking-wider">
            Your 3-Day Experience
          </span>
        </motion.div>

        <BlurText
          as="h2"
          text="Three days. One breakthrough."
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading italic tracking-tight justify-center text-white px-2"
        />

        <motion.p
          {...inView(hydrated, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, { delay: 0.2, duration: 0.7 })}
          className="mt-5 text-white/60 font-body font-light text-base sm:text-lg max-w-2xl leading-relaxed"
        >
          Bring a real business problem. Leave with a real AI-powered path forward — plus the
          relationships and momentum to run with it.
        </motion.p>
      </div>

      <motion.div
        {...inView(hydrated, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { delay: 0.15, duration: 0.7 })}
        className="liquid-glass rounded-2xl p-4 sm:p-5 mb-8 sm:mb-10 flex gap-3 sm:gap-4 items-start"
      >
        <Sparkles className="w-5 h-5 text-white/50 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-white/70 font-body font-light text-sm sm:text-base leading-relaxed text-left">
          <span className="text-white/90 font-medium">Arriving early?</span> If you're in town the evening of{' '}
          {WELCOME_RECEPTION.date}, join us around 8 for ice cream at the Creamery — purely social,
          for whoever's already here.
        </p>
      </motion.div>

      <div className="flex flex-col gap-5 sm:gap-6">
        {RETREAT_DAYS.map((day, dayIdx) => (
          <motion.article
            key={day.day}
            {...inView(
              hydrated,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0 },
              { delay: dayIdx * 0.1, duration: 0.65 },
            )}
            className="liquid-glass rounded-2xl p-5 sm:p-6 md:p-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
              <div className="lg:w-56 xl:w-64 shrink-0 lg:border-r lg:border-white/10 lg:pr-6">
                <p className="text-white/40 text-xs font-body font-medium uppercase tracking-widest mb-1">
                  Day {day.day} · {day.date}
                </p>
                <h3 className="text-2xl sm:text-3xl font-heading italic text-white tracking-tight leading-tight">
                  {day.title}
                </h3>
                <p className="mt-2 text-white/55 font-body font-light text-sm leading-relaxed">
                  {day.tagline}
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4">
                {day.blocks.map((block) => {
                  const Icon = periodIcons[block.period] ?? Sun;
                  return (
                    <div key={block.period}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-4 h-4 text-white/45" aria-hidden="true" />
                        <span className="text-xs font-body font-semibold uppercase tracking-wider text-white/55">
                          {block.period}
                          {block.sub ? (
                            <span className="text-white/30 font-medium"> · {block.sub}</span>
                          ) : null}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {block.items.map((item) => {
                          const [lead, ...rest] = item.split(' — ');
                          const detail = rest.join(' — ');
                          return (
                            <li
                              key={item}
                              className="text-sm font-body font-light text-white/60 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.55em] before:w-1 before:h-1 before:rounded-full before:bg-white/35"
                            >
                              <span className="text-white/85 font-medium">{lead}</span>
                              {detail ? ` — ${detail}` : null}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.p
        {...inView(hydrated, { opacity: 0 }, { opacity: 1 }, { delay: 0.3, duration: 0.6 })}
        className="mt-8 text-center text-white/40 font-body font-light text-sm italic"
      >
        Optional open build time each evening with Braydon Carter, Tony Child, and Bill Banta
      </motion.p>

      <motion.div
        {...inView(hydrated, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, { delay: 0.35, duration: 0.6 })}
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <a
          href={agendaDownloads.oneSheet}
          download
          className="liquid-glass-strong hover:bg-white/5 transition-colors rounded-full px-6 py-3 text-white font-medium text-sm inline-flex items-center gap-2 min-h-[44px]"
        >
          <Download className="w-4 h-4 opacity-70" aria-hidden="true" />
          Download What to Expect (PDF)
        </a>
        <a
          href={agendaDownloads.full}
          download
          className="rounded-full px-6 py-3 text-white/70 hover:text-white transition-colors font-medium text-sm inline-flex items-center gap-2 min-h-[44px]"
        >
          Full 5-page agenda
        </a>
      </motion.div>
    </section>
  );
}
