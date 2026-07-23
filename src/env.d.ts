/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_APPLICATION_WEBHOOK?: string;
  readonly PUBLIC_WEBINAR_WEBHOOK?: string;
  readonly PUBLIC_SUPABASE_URL?: string;
  readonly PUBLIC_SUPABASE_ANON_KEY?: string;
  readonly PUBLIC_JETS_CAPITAL_CHECKOUT_URL?: string;
  readonly PUBLIC_JETS_CAPITAL_BOOKING_URL?: string;
  readonly PUBLIC_X_ROOM_CHECKOUT_URL?: string;
  readonly PUBLIC_X_ROOM_BOOKING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
