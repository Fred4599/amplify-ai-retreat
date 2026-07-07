import type { Sponsor } from './site';

/** Jets & Capital — exclusive investor & family office networking community. */
export const JETS_AND_CAPITAL: Sponsor = {
  name: 'Jets & Capital',
  logoPath: '/jets-and-capital-logo.png',
  url: 'https://jetsandcapital.com/',
};

export const JETS_AND_CAPITAL_LANDING = {
  path: '/jets-and-capital',
  title: 'Amplify AI Retreat — Jets & Capital Community',
  description:
    'A 3-day AI implementation retreat for Jets & Capital members — family offices, investors, and operators. July 29–31, 2026 in Logan, Utah. Reserve your seat or book a quick call to learn more.',
  badge: 'Jets & Capital Community',
  headline: 'Three Days, One Breakthrough',
  subheadline:
    'Built for investors, family offices, and operators who deploy capital — and want AI working as hard as they do.',
  investment: '$4,000',
  ctas: {
    checkout: {
      label: 'Reserve Your Seat',
      url: import.meta.env.PUBLIC_JETS_CAPITAL_CHECKOUT_URL ?? '',
    },
    booking: {
      label: 'Book a 15-Min Call',
      url: import.meta.env.PUBLIC_JETS_CAPITAL_BOOKING_URL ?? '',
    },
  },
} as const;
