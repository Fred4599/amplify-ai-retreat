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
  tagline: 'Which side of the gap are you on?',
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
    'A free live webinar for business owners navigating an AI-dominated world. Discover whether you are falling behind, how AI can be your differentiator, and how to let AI help you — without fear of replacement.',
} as const;

export const WORKSHOP_THEMES = [
  {
    eyebrow: 'The reality check',
    title: 'Falling behind in an AI-dominated world',
    body: 'AI is not coming — it is already reshaping how businesses market, sell, operate, and compete. The gap between owners who adapt and those who wait is widening every quarter. This session starts with an honest look at where you stand.',
  },
  {
    eyebrow: 'The fork in the road',
    title: 'Which one are you? AI as the differentiator',
    body: 'Some businesses treat AI as a novelty. Others use it to move faster, serve better, and win deals their competitors cannot. We will map the two paths — and help you see clearly which one you are on today.',
  },
  {
    eyebrow: 'The mindset shift',
    title: 'Let AI help you — not replace you',
    body: 'The biggest blocker is not the technology. It is openness. We will talk about how to invite AI into your workflow as a partner that amplifies what you already do well — without losing the human judgment that makes your business yours.',
  },
] as const;
