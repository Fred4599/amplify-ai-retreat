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
  /** Hero screenshot for link previews — run `npm run generate:og` after hero changes. */
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

export type Sponsor = {
  name: string;
  logoPath: string;
  url: string;
};

/** Main sponsor — featured in the hero as "Presented by". */
export const PRESENTER: Sponsor = {
  name: 'Taba Collective',
  logoPath: '/taba-collective-logo.png',
  url: 'https://www.tabacollective.com',
};

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

/** Supporting sponsors — shown in the partner carousel. */
export const SPONSORS: readonly Sponsor[] = [
  {
    name: 'Crest Capital Partners',
    logoPath: '/crest-capital-logo.png',
    url: 'https://crestcapitalutah.com/',
  },
  {
    name: 'Aylara Pelvic Health',
    logoPath: '/aylara-logo.png',
    url: 'https://aylarapelvichealth.com/',
  },
  {
    name: 'The Hive Event Center',
    logoPath: '/the-hive-logo.png',
    url: VENUE.url,
  },
] as const;

export function venueAddressLine() {
  return `${VENUE.streetAddress}, ${VENUE.addressLocality}, ${VENUE.addressRegion} ${VENUE.postalCode}`;
}

export function absoluteUrl(path = '/') {
  const base = SITE.url.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
