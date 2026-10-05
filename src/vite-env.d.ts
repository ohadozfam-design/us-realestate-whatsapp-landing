/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Webhook that receives registrations as a JSON POST { name, email, phone }. */
  readonly VITE_LEAD_WEBHOOK_URL?: string;
  /** Meta (Facebook) Pixel ID. When set, the pixel is initialized client-side. */
  readonly VITE_META_PIXEL_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
