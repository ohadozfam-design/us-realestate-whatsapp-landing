# וובינר נדל״ן בארה״ב — דף נחיתה

דף נחיתה להרשמה חינמית לוובינר לייב בזום. בנוי RTL מלא, Mobile-First, עם CTA דביק במובייל.

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
| `HeroSection.tsx` | כותרת, תת-כותרת, מועד ו-CTA ראשי |
| `ValueSection.tsx` | מה מקבלים בוובינר ולמי זה מתאים |
| `RegistrationSection.tsx` | טופס הרשמה חינמי (שם, אימייל, טלפון + אישור דיוור) |
| `StickyMobileCTA.tsx` | CTA דביק בתחתית המובייל |
| `ThankYouPage.tsx` | עמוד תודה: קבוצת WhatsApp, הוספה ליומן Google, פרטי השידור |

## מה צריך לעדכן לפני כל מחזור
- **מועד הוובינר** — `src/lib/site.ts` (תאריך, יום, שעות, `iso` ליומן).
- **משתני סביבה** — ראו `.env.example`:
  - `VITE_LEAD_WEBHOOK_URL` — לאן נשלחות ההרשמות (`{ name, email, phone, marketingConsent, submittedAt }`).
  - `VITE_WHATSAPP_GROUP_URL` — קישור לקבוצת ה-WhatsApp בעמוד התודה.
  - `VITE_META_PIXEL_ID`, `GOOGLE_SHEET_WEBHOOK_URL`, `SITE_URL` — אופציונליים.
- **תמונת OG לשיתוף** — `public/images/og-cover.jpg` (1200×630).
