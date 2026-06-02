/** Canonical site metadata — used for SEO, sitemap, and Open Graph. */
export const SITE = {
  name: 'Amplify AI Retreat',
  title: 'Amplify AI Retreat — Three Days, One AI Breakthrough',
  description:
    'A 3-day immersive AI implementation retreat for business owners, July 29–31, 2026 in Logan, Utah. Bring your biggest bottleneck. Leave with a real AI-powered path forward. Only 50 seats.',
  /** Set PUBLIC_SITE_URL in Vercel (e.g. https://retreat.amplifyai.dev) */
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://retreat.amplifyai.dev',
  locale: 'en_US',
  twitterHandle: '@amplifyai',
  /** Hero-style card for link previews — run `npm run generate:og` after hero copy changes. */
  ogImage: '/media/og-image.webp',
  logoPath: '/logo.png',
  keywords: [
    'AI retreat',
    'AI implementation',
    'business owners',
    'entrepreneur retreat',
    'AI workshop',
    'AI mastermind',
    'practical AI',
    'Amplify AI',
  ],
} as const;

/** Presenting partner — logo lives at `public/elevated-worldwide-logo.png`. */
export const PRESENTER = {
  name: 'Elevated Worldwide',
  logoPath: '/elevated-worldwide-logo.png',
} as const;

/** Retreat dates — July 29–31, 2026 (Logan, UT). */
export const EVENT = {
  startDate: '2026-07-29',
  endDate: '2026-07-31',
} as const;

export function eventDatesLine() {
  return 'July 29–31, 2026';
}

/** In-person venue — [The Hive](https://thehivelogan.com/) Event Center, downtown Logan. */
export const VENUE = {
  name: 'The Hive Event Center',
  streetAddress: '255 S Main Street, Suite 100',
  addressLocality: 'Logan',
  addressRegion: 'UT',
  postalCode: '84321',
  url: 'https://thehivelogan.com/',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=255+S+Main+Street+Suite+100+Logan+UT+84321',
} as const;

export function venueAddressLine() {
  return `${VENUE.streetAddress}, ${VENUE.addressLocality}, ${VENUE.addressRegion} ${VENUE.postalCode}`;
}

export function absoluteUrl(path = '/') {
  const base = SITE.url.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
