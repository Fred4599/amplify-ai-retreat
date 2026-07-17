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

/** Free webinar — July 20, 2026. */
export const WORKSHOP = {
  title: 'The AI Advantage: Save Time, Cut Costs & Grow Revenue',
  tagline: 'Practical AI strategies for business owners and entrepreneurs.',
  subtitle: 'Free Live Webinar',
  /** ISO date for schema.org and sorting */
  date: '2026-07-20',
  /** Display line for the hero and form */
  dateLine: 'Monday, July 20, 2026',
  timeLine: '6:30 p.m. Mountain Time',
  /** MDT in July — Utah observes daylight time */
  startDateIso: '2026-07-20T18:30:00-06:00',
  durationMinutes: 60,
  path: '/workshop',
  description:
    'AI can do far more than write emails or generate social media posts. When used strategically, it can help you eliminate repetitive work, reduce unnecessary expenses, improve customer experiences, and uncover new opportunities for growth.',
  audienceDescription:
    'Join us for a practical webinar designed to help business owners and entrepreneurs understand what AI can actually do for them. You do not need to be an AI expert. Bring an open mind, a business challenge, and a willingness to explore what is possible.',
  bottomTitle: 'Discover Your Biggest AI Opportunity',
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

export const WORKSHOP_OUTCOMES = [
  'Identify tasks and bottlenecks AI could remove from your business',
  'Discover practical ways to save hours of work each week',
  'Learn how AI can reduce costs and improve efficiency',
  'Explore ways to generate leads, improve follow-up, and increase revenue',
  'Leave with clear ideas you can begin implementing immediately',
] as const;
