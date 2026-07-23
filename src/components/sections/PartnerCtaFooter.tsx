import { motion } from 'motion/react';
import BlurText from '../BlurText';
import { useHydrated } from '../useHydrated';
import { inView } from '../motionPresets';
import { MapPin } from 'lucide-react';
import { VENUE, eventDatesLine, venueAddressLine } from '../../config/site';
import { WELCOME_RECEPTION } from '../../content/retreat';

const options = (
  checkoutUrl: string,
  bookingUrl: string,
  pricing: { retail: string; partner: string },
  partnerName: string,
) => [
  {
    title: 'Reserve your seat',
    desc: `Secure your spot at the retreat. ${pricing.partner} for ${partnerName} members (${pricing.retail} value) — payment confirms your seat.`,
    href: checkoutUrl,
    label: 'Reserve Your Seat',
    primary: true,
  },
  {
    title: 'Have questions first?',
    desc: 'Book a quick 15-minute call with our team. We’ll walk you through the experience and answer anything on your mind.',
    href: bookingUrl,
    label: 'Book a 15-Min Call',
    primary: false,
  },
];

const footerLinks = (checkoutUrl: string, bookingUrl: string) => [
  { label: 'Schedule', href: '#schedule' },
  { label: 'Experience', href: '#experience' },
  { label: 'Guides', href: '#guides' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Reserve', href: checkoutUrl },
  { label: 'Book a Call', href: bookingUrl },
];

type PartnerCtaFooterProps = {
  partnerName: string;
  checkoutUrl: string;
  bookingUrl: string;
  checkoutLabel: string;
  bookingLabel: string;
  pricing: { retail: string; partner: string; note: string };
};

export default function PartnerCtaFooter({
  partnerName,
  checkoutUrl,
  bookingUrl,
  checkoutLabel,
  bookingLabel,
  pricing,
}: PartnerCtaFooterProps) {
  const hydrated = useHydrated();
  const choices = options(checkoutUrl, bookingUrl, pricing, partnerName).map((option, index) =>
    index === 0 ? { ...option, label: checkoutLabel } : { ...option, label: bookingLabel },
  );

  return (
    <>
      <div className="flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto w-full mb-12 sm:mb-20 pt-20 sm:pt-32">
        <motion.div
          {...inView(hydrated, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
          className="liquid-glass rounded-full px-4 py-1.5 mb-6"
        >
          <span className="text-white text-xs font-medium font-body uppercase tracking-wider">
            {partnerName} Access
          </span>
        </motion.div>

        <BlurText
          as="h2"
          text="Ready to join us?"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading italic tracking-tight justify-center text-white mb-6 px-1"
        />

        <motion.p
          {...inView(hydrated, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { delay: 0.4, duration: 0.8 })}
          className="text-white/60 font-body font-light text-base sm:text-lg mb-6 max-w-xl mx-auto px-1"
        >
          Exclusive access for {partnerName} members. Reserve your seat directly, or book a quick
          15-minute call if you&apos;d like to learn more first.
        </motion.p>

        <motion.div
          {...inView(hydrated, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, { delay: 0.5, duration: 0.7 })}
          className="liquid-glass rounded-2xl px-6 py-4 mb-12 flex flex-col items-center gap-2"
        >
          <span className="text-white/55 font-body text-xs uppercase tracking-widest">{pricing.note}</span>
          <div className="flex items-center gap-3">
            <span className="text-white/45 font-body text-lg sm:text-xl line-through decoration-white/35">
              {pricing.retail}
            </span>
            <span className="text-white font-heading italic text-2xl sm:text-3xl tracking-tight">
              {pricing.partner}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-12">
          {choices.map((choice, idx) => (
            <motion.div
              key={choice.title}
              {...inView(
                hydrated,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0 },
                { delay: 0.5 + idx * 0.12, duration: 0.6 },
              )}
              className="liquid-glass rounded-2xl p-6 text-left flex flex-col"
            >
              <h5 className="text-xl font-heading italic text-white mb-2 tracking-tight">{choice.title}</h5>
              <p className="text-white/60 font-body font-light text-sm leading-relaxed mb-6 flex-1">
                {choice.desc}
              </p>
              <a
                href={choice.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  choice.primary
                    ? 'bg-white text-black hover:bg-white/90 transition-colors duration-300 rounded-full px-8 py-3.5 font-medium text-sm text-center'
                    : 'liquid-glass-strong hover:scale-[1.02] transition-transform duration-300 rounded-full px-8 py-3.5 text-white font-medium text-sm text-center'
                }
              >
                {choice.label}
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...inView(hydrated, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { delay: 0.9, duration: 0.8 })}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black hover:bg-white/90 transition-colors duration-300 rounded-full px-8 py-3.5 font-medium text-sm w-full sm:w-auto inline-block text-center"
          >
            {checkoutLabel}
          </a>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-strong hover:scale-105 transition-transform duration-300 rounded-full px-8 py-3.5 text-white font-medium text-sm w-full sm:w-auto inline-block text-center"
          >
            {bookingLabel}
          </a>
        </motion.div>
      </div>

      <div className="relative z-10 w-full border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <p className="text-white/40 text-xs font-body font-light leading-relaxed">
              © 2026 Amplify AI Retreat. Unlock human potential through AI.
            </p>
            <p className="text-white/40 text-xs font-body font-light">
              {eventDatesLine()} · Optional Creamery meetup {WELCOME_RECEPTION.date}
            </p>
            <a
              href={VENUE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-white/40 hover:text-white/70 text-xs font-body font-light transition-colors text-center md:text-left mt-1"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-[0.15em]" aria-hidden="true" />
              <span className="leading-snug">
                <span className="block">{VENUE.name}</span>
                <span className="block">{venueAddressLine()}</span>
              </span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {footerLinks(checkoutUrl, bookingUrl).map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.label === 'Reserve' || item.label === 'Book a Call' ? '_blank' : undefined}
                rel={
                  item.label === 'Reserve' || item.label === 'Book a Call'
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="text-white/40 hover:text-white transition-colors text-xs font-body font-light"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
