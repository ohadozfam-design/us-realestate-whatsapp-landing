import { motion } from "framer-motion";
import {
  CheckCircle2,
  Mail,
  Video,
  Inbox,
  ArrowLeft,
  CalendarPlus,
} from "lucide-react";
import { SITE } from "../lib/site";
import EventTicket from "./EventTicket";
import WhatsAppIcon from "./ui/WhatsAppIcon";

const WHATSAPP_GROUP_URL =
  import.meta.env.VITE_WHATSAPP_GROUP_URL || "https://tinyurl.com/mesahkimnadlan";

/** Google Calendar "add event" link for the live session, in Israel local time. */
function googleCalendarUrl(): string {
  const day = SITE.iso.replace(/-/g, "");
  const time = (t: string) => t.replace(":", "") + "00";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "וובינר מנוע העסקאות · לייב בזום",
    dates: `${day}T${time(SITE.startTime)}/${day}T${time(SITE.endTime)}`,
    ctz: SITE.timeZone,
    details: "שידור חי בזום. הקישור לזום יישלח במייל ובקבוצת ה-WhatsApp לפני השידור.",
    location: "Zoom",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/**
 * Post-registration thank-you page. The registration form redirects here
 * (/thank-you) after the lead is sent. It confirms the signup, puts the
 * WhatsApp group first (where the Zoom link and reminders arrive, alongside
 * the confirmation email) and lays out what happens next.
 */
export default function ThankYouPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center px-5 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-2xl"
      >
        {/* Confirmation header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 sm:h-20 sm:w-20">
            <CheckCircle2 className="h-8 w-8 text-gold sm:h-11 sm:w-11" strokeWidth={2} aria-hidden="true" />
          </div>

          <span className="eyebrow mt-4 inline-block">ההרשמה הושלמה</span>
          <h1 className="mt-3 text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-cloud sm:text-5xl">
            ההרשמה שלך לוובינר אושרה!
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-balance text-lg leading-relaxed text-drift sm:text-xl">
            הלינק הישיר לזום יישלח אליך בקבוצת ה-WhatsApp ובמייל.
          </p>
        </div>

        {/* WhatsApp group - the primary next action after signup */}
        <div className="mt-6 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/[0.08] p-5 text-center sm:mt-8 sm:p-8">
          <span className="mx-auto hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/15 sm:flex">
            <WhatsAppIcon className="h-8 w-8 text-[#25D366]" />
          </span>
          <h2 className="text-balance text-2xl font-extrabold leading-[1.15] tracking-tight text-cloud sm:mt-4 sm:text-3xl">
            שלב אחרון: הצטרפות לקבוצת ה-WhatsApp של הוובינר
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-balance text-base leading-relaxed text-drift sm:text-lg">
            הקבוצה פתוחה לשאלות, דיונים, וכמובן קבלת הלינק הישיר לשידור הלייב
            ותזכורות בזמן אמת.
          </p>
          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#25D366] px-4 py-4 text-base font-extrabold text-night shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] transition duration-200 hover:bg-[#1fbd5b] motion-safe:hover:-translate-y-0.5 sm:gap-2.5 sm:px-6 sm:text-xl"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
            הצטרפות לקבוצת ה-WhatsApp ←
          </a>
        </div>

        {/* Add the session to Google Calendar */}
        <a
          href={googleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-4 flex items-center justify-center gap-3 rounded-xl border border-drift/25 bg-cloud/[0.04] px-4 py-3.5 text-base font-bold text-cloud transition-colors hover:border-gold/50 hover:bg-cloud/[0.07]"
        >
          <CalendarPlus className="h-6 w-6 shrink-0 text-gold" strokeWidth={2.2} aria-hidden="true" />
          <span className="flex flex-col text-right leading-snug">
            <span>הוספה ליומן Google</span>
            <span className="text-sm font-semibold text-drift">
              {SITE.eventDay}, {SITE.eventDate} · {SITE.startTime}
            </span>
          </span>
        </a>

        <EventTicket />

        {/* What happens next - the email timeline */}
        <div className="mt-12 rounded-2xl border border-drift/15 bg-cloud/[0.04] p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-cloud sm:text-3xl">
            מה קורה עכשיו?
          </h2>

          <ol className="mt-6 space-y-6">
            {/* Step 1 - immediate confirmation email */}
            <li className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15">
                <Mail className="h-6 w-6 text-gold" strokeWidth={2.2} aria-hidden="true" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-lg font-extrabold text-cloud sm:text-xl">
                    מייל האישור: תוך דקות ספורות
                  </span>
                  <span className="rounded-full bg-gold/15 px-3 py-0.5 text-sm font-bold text-gold">
                    אוטומטי
                  </span>
                </div>
                <p className="mt-1.5 text-base leading-relaxed text-drift sm:text-lg">
                  מייל אישור עם פרטי השידור יגיע לכתובת שאיתה נרשמת, בדרך כלל תוך
                  דקות ספורות. <strong className="text-cloud">הלינק הישיר לזום</strong> יישלח
                  לפני השידור גם במייל וגם בקבוצת ה-WhatsApp.
                </p>
              </div>
            </li>

            {/* Step 2 - check spam */}
            <li className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15">
                <Inbox className="h-6 w-6 text-gold" strokeWidth={2.2} aria-hidden="true" />
              </div>
              <div>
                <span className="block text-balance text-lg font-extrabold text-cloud sm:text-xl">
                  לא רואה את המייל? בדוק ספאם/קידומים
                </span>
                <p className="mt-1.5 text-base leading-relaxed text-drift sm:text-lg">
                  אם המייל לא מופיע בתיבת הדואר הנכנס, הצץ בתיקיות{" "}
                  <strong className="text-cloud">ספאם</strong> או{" "}
                  <strong className="text-cloud">קידומי מכירות</strong>. מומלץ לשמור את
                  המייל ולסמן אותו כ"לא ספאם" כדי שלא תפספס עדכונים.
                </p>
              </div>
            </li>

            {/* Step 3 - day of the webinar */}
            <li className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15">
                <Video className="h-6 w-6 text-gold" strokeWidth={2.2} aria-hidden="true" />
              </div>
              <div>
                <span className="block text-balance text-lg font-extrabold text-cloud sm:text-xl">
                  ביום הוובינר: נכנסים דרך אותו קישור
                </span>
                <p className="mt-1.5 text-base leading-relaxed text-drift sm:text-lg">
                  מתחברים לזום דרך הקישור שבמייל האישור או בקבוצת ה-WhatsApp, מכל
                  מחשב או נייד. מומלץ להתחבר כ-5 דקות לפני תחילת השידור.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Support + back */}
        <div className="mt-10 text-center">
          <p className="text-base leading-relaxed text-drift sm:text-lg">
            שאלה או בעיה כלשהי? המייל לא הגיע תוך כמה דקות? פשוט השב למייל האישור
            ששלחנו ונחזור אליך.
          </p>

          <a
            href="/"
            className="focus-ring mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-drift/25 px-7 py-3.5 text-lg font-bold text-cloud transition-colors hover:bg-cloud/[0.06]"
          >
            חזרה לדף הבית
            <ArrowLeft className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>

        {/* Signature */}
        <div className="mt-14 border-t border-drift/10 pt-8 text-center">
          <p className="text-lg font-extrabold tracking-tight text-cloud">
            וובינר מנוע העסקאות ל-2 נכסים בחודש
          </p>
          <p className="mt-1 text-sm font-semibold text-drift">עם אוהד עוז</p>
        </div>
      </motion.div>
    </div>
  );
}
