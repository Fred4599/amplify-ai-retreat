/** Self-hosted posters (in /public/media) — first frame of each video; run `node scripts/generate-posters.mjs` to refresh. */
export const MEDIA = {
  posters: {
    hero: '/media/hero-poster.webp',
    featureDay: '/media/feature-day-poster.webp',
    featureEvening: '/media/feature-evening-poster.webp',
    hlsStart: '/media/hls-start-poster.webp',
    hlsStats: '/media/hls-stats-poster.webp',
    hlsCta: '/media/hls-cta-poster.webp',
    og: '/media/og-image.webp',
  },
  /** MP4 clips — lazy-loaded; posters show until in view. */
  videos: {
    hero: 'https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_002442_87557cfb-5754-46a7-ba3c-67e47a4df16a.mp4',
    featureDay:
      'https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_004011_5e1621a5-0a95-4f9b-8cac-46d96bb4d997.mp4',
    featureEvening:
      'https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_004522_dd9e568e-ee7f-45c7-9499-2b7bcd2e41aa.mp4',
  },
} as const;
