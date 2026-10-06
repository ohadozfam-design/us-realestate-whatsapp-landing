/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** WhatsApp community invite link every join button points to. */
  readonly VITE_WHATSAPP_GROUP_URL?: string;
  /** Meta (Facebook) Pixel ID. When set, the pixel is initialized client-side. */
  readonly VITE_META_PIXEL_ID?: string;
  /** Google Tag id: G-XXXX (GA4), AW-XXXX (Google Ads) or GTM-XXXX (Tag Manager). */
  readonly VITE_GOOGLE_TAG_ID?: string;
  /** Google Ads conversion label (the part after "AW-XXXX/") for the join conversion. */
  readonly VITE_GOOGLE_ADS_CONVERSION_LABEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
