import type { Sponsor } from './site';

/** Jets & Capital — exclusive investor & family office networking community. */
export const JETS_AND_CAPITAL: Sponsor = {
  name: 'Jets & Capital',
  logoPath:
    'https://static1.squarespace.com/static/67e403a400b10d26175380bd/t/67e406b2a9a4983f00779997/1768246375220/2.png',
  url: 'https://jetsandcapital.com/',
};

export const JETS_AND_CAPITAL_LANDING = {
  path: '/jets-and-capital',
  title: 'Amplify AI Retreat — Jets & Capital Community',
  description:
    'A 3-day AI implementation retreat for Jets & Capital members — family offices, investors, and operators. July 29–31, 2026 in Logan, Utah. Exclusive community pricing: $4,000 (regularly $5,000).',
  badge: 'Jets & Capital Community',
  headline: 'Three Days, One Breakthrough',
  subheadline:
    'Built for investors, family offices, and operators who deploy capital — and want AI working as hard as they do.',
  pricing: {
    retail: '$5,000',
    partner: '$4,000',
    note: 'Exclusive Jets & Capital community pricing',
  },
  ctas: {
    checkout: {
      label: 'Reserve Your Seat',
      url:
        import.meta.env.PUBLIC_JETS_CAPITAL_CHECKOUT_URL ??
        'https://keepelevated.com/jets-capital?am_id=alecatkinson4403',
    },
    booking: {
      label: 'Book a 15-Min Call',
      url:
        import.meta.env.PUBLIC_JETS_CAPITAL_BOOKING_URL ??
        'https://api.leadconnectorhq.com/widget/bookings/amplify-ai-retreat-jets',
    },
  },
} as const;
