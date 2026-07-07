import type { Sponsor } from './site';

/** Jets & Capital — exclusive investor & family office networking community. */
export const JETS_AND_CAPITAL: Sponsor = {
  name: 'Jets & Capital',
  logoPath: '',
  url: 'https://jetsandcapital.com/',
};

export const JETS_AND_CAPITAL_LANDING = {
  path: '/jets-and-capital',
  applySource: 'jets-and-capital',
  title: 'Amplify AI Retreat — Jets & Capital Community',
  description:
    'A 3-day AI implementation retreat for Jets & Capital members — family offices, investors, and operators. July 29–31, 2026 in Logan, Utah. Bring your biggest bottleneck. Leave with a real AI-powered path forward.',
  badge: 'Jets & Capital Community',
  headline: 'Three Days, One Breakthrough',
  subheadline:
    'Built for investors, family offices, and operators who deploy capital — and want AI working as hard as they do.',
  applyLabel: 'Apply to Attend',
} as const;

export function jetsAndCapitalApplyHref() {
  return `/apply?source=${JETS_AND_CAPITAL_LANDING.applySource}`;
}
