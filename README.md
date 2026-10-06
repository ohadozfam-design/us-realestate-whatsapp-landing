# קהילת משקיעי הנדל״ן בארה״ב — דף נחיתה

מיקרו-דף נחיתה להצטרפות לקהילת WhatsApp סגורה. בלי טפסים: כל כפתור מוביל ישירות לקבוצה. בנוי RTL מלא, Mobile-First, עם CTA דביק במובייל.

## סטאק
- **Vite + React 18 + TypeScript**
- **Tailwind CSS** (פלטת night/cloud/drift + זהב — מוגדרת ב-`tailwind.config.js`)
- **Framer Motion** — מיקרו-אנימציות וגלילה
- **lucide-react** — אייקונים
- גופן **Assistant** (Google Fonts, נטען ב-`index.html`)

## הרצה
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # בנייה לפרודקשן (dist/)
npm run preview  # תצוגה מקדימה של הבנייה
```

## מבנה הרכיבים (`src/components/`)
| רכיב | תיאור |
|------|-------|
| `HeroSection.tsx` | תגית, כותרת, תת-כותרת ו-CTA ראשי ל-WhatsApp |
| `ShowcaseSection.tsx` | צילומי מסך מהקהילה (הוכחה חברתית), בעמודה אחת קריאה |
| `StickyMobileCTA.tsx` | כפתור WhatsApp דביק בתחתית המובייל |
| `ui/WhatsAppButton.tsx` | כפתור ההצטרפות: קישור לקבוצה + אירועי מעקב |

ה-CTA התחתון והפוטר נמצאים ב-`App.tsx`.

## מה צריך לעדכן
- **קופי וצילומי מסך** — `src/lib/site.ts` (כותרת, `SCREENSHOTS`). קבצי התמונות ב-`public/screenshots/`.
- **משתני סביבה** — ראו `.env.example`:
  - `VITE_WHATSAPP_GROUP_URL` — קישור ההזמנה לקבוצה (ברירת מחדל ב-`src/lib/site.ts`).
  - `VITE_META_PIXEL_ID`, `VITE_GOOGLE_TAG_ID`, `VITE_GOOGLE_ADS_CONVERSION_LABEL`, `SITE_URL` — אופציונליים.
- **תמונת OG לשיתוף** — `public/images/og-cover.jpg` (1200×630).

## מעקב
לחיצה על כפתור הצטרפות שולחת `Lead` + `JoinWhatsApp` (Meta Pixel) ו-`generate_lead` (Google Tag), פעם אחת לכל טעינת עמוד, עם מיקום הכפתור (`hero` / `bottom` / `sticky`).
