import { CheckCircle2 } from "lucide-react";
import Reveal from "./ui/Reveal";
import CtaButton from "./ui/CtaButton";
import { SITE, scrollToRegister } from "../lib/site";

const outcomes = [
  "תדע איך ליצור קשר עם בעלי מקצוע שישלחו לך עסקאות טובות בכל חודש.",
  "תנתח עסקה בפחות מ5 דקות, ותציע לפחות 5 הצעות נכונות ביום",
  "תחזיק במערכת עבודה מסודרת שמייצרת ומגישה הצעות מחיר באופן עקבי בכל שבוע",
  "תרכוש מהר את האמון של הסוכנים ובעלי המקצוע כך שירצו לעבוד איתך",
];

const details = [
  { label: "מתי", body: `${SITE.eventDay}, ${SITE.eventDate} · ${SITE.eventHours}` },
  { label: "איפה", body: "שידור חי אינטראקטיבי בזום, כולל סשן שאלות ותשובות פתוח" },
  { label: "למי זה מתאים", body: "למשקיעים ויזמים שרוצים להכנס ללפחות 2 עסקאות בחודש" },
  { label: "מה להכין", body: "מחשב נייד, מחברת וראש פתוח לפרקטיקה" },
];

export default function ValueSection() {
  return (
    <section className="px-5 py-16 md:py-24" aria-labelledby="value-heading">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">מה מקבלים בוובינר</span>
            <h2
              id="value-heading"
              className="mx-auto mt-5 max-w-3xl text-balance font-extrabold leading-tight tracking-tight text-cloud text-[clamp(2rem,4.8vw,3.3rem)]"
            >
              {SITE.eventFormatShort}, ובסופה יש לך מנוע עסקאות שעובד
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
            {outcomes.map((o) => (
              <li key={o} className="flex h-full items-start gap-3.5 rounded-2xl border border-drift/25 bg-cloud/[0.04] p-6 text-lg font-semibold leading-relaxed text-cloud md:text-xl">
                <CheckCircle2
                  className="mt-0.5 h-7 w-7 shrink-0 text-emerald-400"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-drift/15 bg-drift/15 sm:grid-cols-2 lg:grid-cols-4">
            {details.map((d) => (
              <div key={d.label} className="bg-night p-6 text-center sm:p-7">
                <dt className="text-xl font-extrabold tracking-tight text-gold sm:text-2xl">
                  {d.label}
                </dt>
                <dd className="mt-2 text-lg leading-relaxed text-drift">{d.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mx-auto mt-10 w-full max-w-md">
            <CtaButton onClick={scrollToRegister}>שריין את המקום שלי בוובינר</CtaButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
