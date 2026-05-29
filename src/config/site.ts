/** Canonical site metadata — used for SEO, sitemap, and Open Graph. */
export const SITE = {
  name: 'Amplify AI Retreat',
  title: 'Amplify AI Retreat — Three Days, One AI Breakthrough',
  description:
    'A 3-day immersive AI implementation retreat for business owners. Bring your biggest bottleneck. Leave with a real AI-powered path forward. Only 50 seats.',
  /** Set PUBLIC_SITE_URL in Vercel (e.g. https://retreat.amplifyai.dev) */
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://retreat.amplifyai.dev',
  locale: 'en_US',
  twitterHandle: '@amplifyai',
  ogImage:
    'https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_002227_85b4b9bf-5754-49f2-8e95-a6cefa33b080.png',
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
