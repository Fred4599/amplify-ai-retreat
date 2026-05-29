/**
 * Regenerate poster images from the same sources as the site videos.
 * Run: node scripts/generate-posters.mjs
 */
import { execFileSync } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import ffmpegPath from 'ffmpeg-static';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/media');

const MP4_POSTERS = [
  {
    file: 'hero-poster.webp',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_002442_87557cfb-5754-46a7-ba3c-67e47a4df16a.mp4',
  },
  {
    file: 'feature-day-poster.webp',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_004011_5e1621a5-0a95-4f9b-8cac-46d96bb4d997.mp4',
  },
  {
    file: 'feature-evening-poster.webp',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_37kxLwJsfncQ2oMMpHzKiXdRCcJ/hf_20260529_004522_dd9e568e-ee7f-45c7-9499-2b7bcd2e41aa.mp4',
  },
];

const MUX_POSTERS = [
  { file: 'hls-start-poster.webp', playbackId: '9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A' },
  { file: 'hls-stats-poster.webp', playbackId: 'NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM' },
  { file: 'hls-cta-poster.webp', playbackId: '8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q' },
];

await mkdir(outDir, { recursive: true });

for (const { file, url } of MP4_POSTERS) {
  const dest = join(outDir, file);
  console.log(`MP4 → ${file}`);
  execFileSync(ffmpegPath, ['-y', '-ss', '0.1', '-i', url, '-frames:v', '1', '-vf', 'scale=1920:-2', '-q:v', '85', dest], {
    stdio: 'inherit',
  });
}

for (const { file, playbackId } of MUX_POSTERS) {
  const dest = join(outDir, file);
  const thumbUrl = `https://image.mux.com/${playbackId}/thumbnail.webp?time=0&width=1920`;
  console.log(`Mux → ${file}`);
  const res = await fetch(thumbUrl);
  if (!res.ok) throw new Error(`Failed ${thumbUrl}: ${res.status}`);
  await pipeline(res.body, createWriteStream(dest));
}

console.log('Done. Posters written to public/media/');
