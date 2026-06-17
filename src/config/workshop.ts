import type { Sponsor } from './site';

/** Presented by Elevated Worldwide — separate from the retreat's Taba Collective presenter. */
export const WORKSHOP_PRESENTER: Sponsor = {
  name: 'Elevated Worldwide',
  logoPath: '/elevated-worldwide-logo.png',
  url: 'https://keepelevated.com/',
};

export const WORKSHOP_HOSTS = [
  {
    name: 'Braydon Carter',
    role: 'AI Strategist & Builder',
    photo: '/media/guide-braydon-carter.webp',
  },
  {
    name: 'Tony Child',
    role: 'Mindset & Transformation',
    photo: '/media/guide-tony-child.webp',
  },
  {
    name: 'Bill Banta',
    role: 'Coaching & Strategy',
    photo: '/media/guide-bill-banta.webp',
  },
] as const;

/** Free webinar — June 19, 2026. */
export const WORKSHOP = {
  title: 'AI: The Differentiator',
  tagline: 'Turn AI into revenue, speed, and leverage — starting this Friday.',
  subtitle: 'Free Live Webinar',
  /** ISO date for schema.org and sorting */
  date: '2026-06-19',
  /** Display line for the hero and form */
  dateLine: 'Friday, June 19, 2026',
  timeLine: '11:00 a.m. Mountain Time',
  /** MDT in June — Utah observes daylight time */
  startDateIso: '2026-06-19T11:00:00-06:00',
  durationMinutes: 60,
  path: '/workshop',
  description:
    'A free live session for business owners ready to use AI to win more deals, save hours every week, and stay ahead of competitors still guessing. Walk away with a clear picture of where AI fits in your business — and your next move.',
  /** Update manually as registrations come in — shown in social proof UI */
  registrationCount: 50,
} as const;

export const WORKSHOP_PROOF_STATS = [
  { value: '30+', label: 'businesses implemented' },
  { value: '25+', label: 'hrs saved per week' },
  { value: '40%', label: 'dead contacts recovered' },
] as const;

export const WORKSHOP_TESTIMONIALS = [
  {
    quote:
      'We recovered 40% of contacts we thought were dead — and turned them into real pipeline.',
    attribution: 'Venture capital firm',
    metric: '40%',
    metricLabel: 'contacts recovered',
  },
  {
    quote: 'Our ops team got back more than 10 hours a week once inventory stopped living in spreadsheets.',
    attribution: 'E-commerce operator',
    metric: '10+',
    metricLabel: 'hrs/week saved',
  },
  {
    quote: 'HR went from drowning in applications to focusing on the candidates who actually fit.',
    attribution: 'Enterprise HR team',
    metric: '20+',
    metricLabel: 'hrs/week saved',
  },
] as const;

export const WORKSHOP_THEMES = [
  {
    eyebrow: 'The opportunity',
    title: 'Where AI is creating margin right now',
    body: 'Owners who move first are winning faster sales cycles, leaner operations, and better client experiences. We will show you where AI is already paying off in real businesses — and where the biggest openings are in yours.',
  },
  {
    eyebrow: 'The playbook',
    title: 'How winning owners use AI as a differentiator',
    body: 'The gap is not about having the fanciest tools. It is about knowing which workflows to automate, which decisions to keep human, and how to stack small wins into compounding advantage. You will leave with a practical lens for evaluating every AI opportunity.',
  },
  {
    eyebrow: 'The unlock',
    title: 'Plug AI into your business without losing what makes you you',
    body: 'The owners who win treat AI as leverage — not a replacement. We will walk through how to adopt AI in a way that amplifies your judgment, protects your brand, and creates capacity you can reinvest in growth.',
  },
] as const;
