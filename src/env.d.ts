/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_APPLICATION_WEBHOOK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
