import { MEDIA } from '../config/media';

export const HLS_BACKGROUNDS = {
  start: {
    src: 'https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8',
    poster: MEDIA.posters.hlsStart,
  },
  stats: {
    src: 'https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8',
    poster: MEDIA.posters.hlsStats,
  },
  cta: {
    src: 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8',
    poster: MEDIA.posters.hlsCta,
  },
} as const;
