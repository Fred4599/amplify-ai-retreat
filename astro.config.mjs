import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL ?? 'https://amplifyairetreat.com';

export default defineConfig({
  site,
  compressHTML: true,
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/apply'),
    }),
  ],
});
