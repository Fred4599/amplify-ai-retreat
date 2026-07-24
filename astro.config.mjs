import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL ?? 'https://retreat.amplifyai.dev';

export default defineConfig({
  site,
  compressHTML: true,
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/apply') &&
        !page.includes('/admin') &&
        !page.includes('/waiver') &&
        !page.includes('/check-in'),
    }),
  ],
});
