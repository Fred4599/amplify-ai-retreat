import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import BlurText from '../BlurText';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';
import {
  AMPLIFY_CASE_STUDIES_URL,
  CASE_STUDIES,
  PROOF_STATS,
} from '../../content/caseStudies';

export default function CaseStudies() {
  const hydrated = useHydrated();

  return (
    <section id="wins" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
        <motion.div
          {...inView(hydrated, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
          className="liquid-glass rounded-full px-4 py-1.5 mb-6"
        >
          <span className="text-white text-xs font-medium font-body uppercase tracking-wider">
            Case Studies & Wins
          </span>
        </motion.div>

        <BlurText
          as="h2"
          text="The same playbook. Your business."
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading italic tracking-tight justify-center text-white px-1 mb-6"
        />

        <motion.p
          {...inView(hydrated, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, { delay: 0.2, duration: 0.7 })}
          className="text-white/60 font-body font-light text-base sm:text-lg max-w-2xl leading-relaxed"
        >
          These highlights are pulled to show breadth: finance, operations, HR, construction,
          healthcare, recruiting, and marketing. At the retreat, you get this same implementation
          mindset applied to your bottleneck.
        </motion.p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
        {PROOF_STATS.map((stat, idx) => (
          <motion.div
            key={stat.label}
            {...inView(
              hydrated,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0 },
              { delay: idx * 0.06, duration: 0.5 },
            )}
            className="liquid-glass rounded-2xl p-4 sm:p-6 text-center"
          >
            <div className="text-2xl sm:text-3xl md:text-4xl font-heading italic text-white tracking-tight">
              {stat.value}
            </div>
            <div className="text-white/55 font-body font-light text-[10px] sm:text-xs uppercase tracking-wide leading-snug mt-2">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {CASE_STUDIES.map((study, idx) => (
          <motion.article
            key={study.title}
            {...inView(
              hydrated,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0 },
              { delay: idx * 0.05, duration: 0.55 },
            )}
            className="liquid-glass rounded-2xl p-6 sm:p-8 flex flex-col h-full"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <span className="text-white/45 text-[10px] uppercase tracking-widest font-body">
                {study.category}
              </span>
              <div className="text-right shrink-0">
                <div className="text-2xl sm:text-3xl font-heading italic text-white leading-none">
                  {study.metric}
                </div>
                <div className="text-white/50 text-[10px] uppercase tracking-wider font-body mt-1">
                  {study.metricLabel}
                </div>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-heading italic text-white tracking-tight mb-3">
              {study.title}
            </h3>

            <p className="text-white/65 font-body font-light text-sm leading-relaxed mb-4 flex-1">
              {study.impact}
            </p>

            <p className="text-white/40 font-body font-light text-xs leading-relaxed border-t border-white/10 pt-4">
              <span className="text-white/55">Built:</span> {study.solution}
            </p>
          </motion.article>
        ))}
      </div>

      <motion.div
        {...inView(hydrated, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, { delay: 0.3, duration: 0.6 })}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 sm:mt-16"
      >
        <a
          href={AMPLIFY_CASE_STUDIES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="liquid-glass-strong hover:scale-[1.02] transition-transform duration-300 rounded-full px-6 py-3.5 text-white font-medium text-sm inline-flex items-center gap-2 min-h-[44px]"
        >
          See all case studies on Amplify AI
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </a>
        <a
          href="#outcomes"
          className="text-white/60 hover:text-white font-body text-sm transition-colors min-h-[44px] flex items-center"
        >
          What you’ll leave the retreat with →
        </a>
      </motion.div>
    </section>
  );
}
