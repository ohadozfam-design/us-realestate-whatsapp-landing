// Central place for editable page copy and links.

export const SITE = {
  // Main headline (hero, <title>, og/twitter tags and og-cover.jpg mirror it).
  // headlineAccent is the part of the headline rendered in gold.
  headline: "קהילת WhatsApp סגורה למשקיעים ויזמי נדל״ן בארה״ב",
  headlineAccent: "למשקיעים ויזמי נדל״ן בארה״ב",
  brand: "קהילת משקיעי הנדל״ן בארה״ב",
  owner: "אוהד עוז",
} as const;

/**
 * WhatsApp community invite link, inlined at BUILD time from
 * VITE_WHATSAPP_GROUP_URL (redeploy after changing it).
 */
export const WHATSAPP_GROUP_URL = (import.meta.env.VITE_WHATSAPP_GROUP_URL ?? "").trim();

if (!WHATSAPP_GROUP_URL) {
  console.warn("[site] VITE_WHATSAPP_GROUP_URL is not set - the join buttons have no link.");
}

/** Community screenshots shown in the social-proof section (files live in public/screenshots/). */
export const SCREENSHOTS: { src: string; width: number; height: number; alt: string }[] = [
  {
    src: "/screenshots/chat-1.jpg",
    width: 1044,
    height: 340,
    alt: "הודעת חבר בוואטסאפ: זה סדנא של 400 דולר פלוס, היה מטורף",
  },
];
