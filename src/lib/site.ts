// Central place for editable page copy and links.

export const SITE = {
  eyebrow: "קהילת הוואטסאפ של יזמי ומשקיעי נדל״ן בארה״ב",
  // Hero H1: the plain line, then the gold accent line beneath it.
  headline: "המקום שבו נסגרות עסקאות נדל״ן בארה״ב.",
  headlineAccent: "בלי בולשיט, בלי פילטרים.",
  subheadline:
    "ניתוחי עסקאות בזמן אמת, קשרים עם קבלנים ומתווכים בשטח, ושיח פתוח בין יזמים ומשקיעים שפועלים עכשיו בארה״ב.",
  // Label on every join button (hero, bottom and the mobile sticky bar).
  ctaLabel: "הצטרפות לקהילת הוואטסאפ (חינם)",
  bottomHeadline: "מוכנים להפסיק לפעול לבד?",
  bottomSubheadline:
    "הצטרפו עכשיו לקהילה פעילה של יזמי נדל״ן בארה״ב. בלחיצה אחת אתם בפנים.",
  footer: "קהילת נדל״ן ארה״ב © 2026. כל הזכויות שמורות.",
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
