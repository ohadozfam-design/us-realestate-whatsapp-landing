/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Webhook that receives registrations as a JSON POST (see RegistrationSection). */
  readonly VITE_LEAD_WEBHOOK_URL?: string;
  /** WhatsApp updates-group invite link shown on the /thank-you page. */
  readonly VITE_WHATSAPP_GROUP_URL?: string;
  /** Meta (Facebook) Pixel ID. When set, the pixel is initialized client-side. */
  readonly VITE_META_PIXEL_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
