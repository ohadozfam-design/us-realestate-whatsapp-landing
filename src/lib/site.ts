// Central place for editable page copy and links.

export const SITE = {
  eyebrow: "קהילת הוואטסאפ של יזמי ומשקיעי נדל״ן בארה״ב",
  // Hero H1: the plain line, then the green accent line beneath it.
  headline: "המקום שבו נסגרות עסקאות נדל״ן בארה״ב.",
  headlineAccent: "בלי בולשיט, בלי פילטרים.",
  subheadline:
    "ניתוחי עסקאות בזמן אמת, קשרים עם קבלנים ומתווכים בשטח, ושיח פתוח בין יזמים ומשקיעים שפועלים עכשיו בארה״ב.",
  // Label on every join button (hero, bottom and the mobile sticky bar).
  ctaLabel: "הצטרפות לקהילת הוואטסאפ (חינם)",
  // Reassurance line under the hero CTA, joined with " · ". Each segment stays
  // unbroken; on phones the last one gets its own line.
  ctaMicrocopy: ["לחיצה אחת", "בלי טפסים", "100% ערך יזמות נדל״ן בארה״ב"],
  bottomHeadline: "מוכנים להפסיק לפעול לבד?",
  bottomSubheadline:
    "הצטרפו עכשיו לקהילה פעילה של יזמי נדל״ן בארה״ב. בלחיצה אחת אתם בפנים.",
  footer: "קהילת נדל״ן ארה״ב © 2026. כל הזכויות שמורות.",
} as const;

/** Default community invite link, used when VITE_WHATSAPP_GROUP_URL is unset. */
const DEFAULT_WHATSAPP_GROUP_URL = "https://tinyurl.com/mesahkimnadlan";

/**
 * WhatsApp community invite link every join button points to. Override per
 * environment with VITE_WHATSAPP_GROUP_URL (inlined at BUILD time, so
 * redeploy after changing it); blank or unset falls back to the default.
 */
export const WHATSAPP_GROUP_URL =
  import.meta.env.VITE_WHATSAPP_GROUP_URL?.trim() || DEFAULT_WHATSAPP_GROUP_URL;

/** Community screenshots shown in the social-proof section, in display order (files live in public/screenshots/). */
export const SCREENSHOTS: { src: string; width: number; height: number; alt: string }[] = [
  {
    src: "/screenshots/first-deal.jpg",
    width: 1205,
    height: 698,
    alt: "הודעת חבר בקבוצת הוואטסאפ: קנינו עכשיו את הנכס הראשון, זה פחות מפחיד ממה שחשבנו. תודה על הקבוצה",
  },
  {
    src: "/screenshots/loan-types.png",
    width: 800,
    height: 1010,
    alt: "פוסט בקבוצה שמסביר את שלושת סוגי ההלוואות לנדל״ן בארה״ב: הלוואות Fix&Flip ו-Hard Money, הלוואות DSCR והלוואות לפי יכולת ההחזר האישית",
  },
];
