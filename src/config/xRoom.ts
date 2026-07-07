import type { Sponsor } from './site';

/** The X Room — community & podcast by Shawn Finnegan & Maeli Nelson. Curate · Connect · Create. */
export const X_ROOM: Sponsor = {
  name: 'The X Room',
  logoPath: '/x-room-logo.png',
  url: 'https://www.xroomx.com/',
};

export const X_ROOM_SOCIAL = {
  instagram: 'https://www.instagram.com/the.xroom/',
  youtube: 'https://www.youtube.com/@x-room-x',
  website: 'https://www.xroomx.com/',
} as const;

export const X_ROOM_LANDING = {
  path: '/x-room',
  title: 'Amplify AI Retreat — The X Room Community',
  description:
    'A 3-day AI implementation retreat for The X Room community — entrepreneurs and leaders who curate, connect, and create. July 29–31, 2026 in Logan, Utah. Exclusive community pricing: $4,000 (regularly $5,000).',
  badge: 'X Room Community',
  headline: 'Three Days, One Breakthrough',
  subheadline:
    'Built for entrepreneurs, creators, and connectors who build community — and want AI working as hard as they do.',
  intro:
    'An exclusive invitation for The X Room community — founded by Shawn Finnegan and Maeli Nelson for leaders who gather to curate, connect, and create.',
  pricing: {
    retail: '$5,000',
    partner: '$4,000',
    note: 'Exclusive X Room community pricing',
  },
  ctas: {
    checkout: {
      label: 'Reserve Your Seat',
      url:
        import.meta.env.PUBLIC_X_ROOM_CHECKOUT_URL ??
        'https://keepelevated.com/x-room?am_id=alecatkinson4403',
    },
    booking: {
      label: 'Book a 15-Min Call',
      url:
        import.meta.env.PUBLIC_X_ROOM_BOOKING_URL ??
        'https://api.leadconnectorhq.com/widget/bookings/amplify-ai-retreat-x-room',
    },
  },
} as const;
