import { CheckCircle2 } from "lucide-react";
import Reveal from "./ui/Reveal";
import CtaButton from "./ui/CtaButton";
import { SITE, scrollToRegister } from "../lib/site";

//   (non-breaking space) keeps each number on the same line as its noun.
const outcomes = [
  "איך ליצור קשר עם בעלי מקצוע שישלחו לך עסקאות טובות בכל חודש",
  "לנתח עסקה בפחות מ-5 דקות, ותציע לפחות 5 הצעות נכונות ביום",
  "מערכת עבודה מסודרת שמייצרת הצעות מחיר באופן עקבי בכל שבוע",
  "תרכוש את האמון של הסוכנים ובעלי המקצוע כך שירצו לעבוד איתך",
];

const details: { label: string; body: string; sub?: string }[] = [
  { label: "מתי", body: `${SITE.eventDay}, ${SITE.eventDate}`, sub: SITE.eventHours },
  { label: "איפה", body: "שידור חי אינטראקטיבי בזום, כולל סשן שאלות ותשובות פתוח" },
  { label: "למי זה מתאים", body: "למשקיעים ויזמים שרוצים להיכנס ללפחות 2 עסקאות בחודש" },
  { label: "מה להכין", body: "מחשב נייד, מחברת וראש פתוח לפרקטיקה" },
];

export default function ValueSection() {
  return (
    <section className="px-5 py-12 md:py-20" aria-labelledby="value-heading">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">מה מקבלים בוובינר</span>
            <h2
              id="value-heading"
              className="mx-auto mt-5 max-w-3xl text-balance font-extrabold leading-[1.15] tracking-tight text-cloud text-[clamp(2rem,4.8vw,3.3rem)]"
            >
              {SITE.eventFormatShort}, ובסופה יש לך מנוע עסקאות שעובד
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {outcomes.map((o) => (
              <li
                key={o}
                className="flex h-full items-start gap-3.5 rounded-2xl border border-drift/15 bg-cloud/[0.04] p-6 text-lg font-medium leading-relaxed text-cloud md:text-xl"
              >
                <CheckCircle2
                  className="mt-0.5 h-7 w-7 shrink-0 text-emerald-400"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
                <span className="text-balance">{o}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-drift/15 bg-drift/15 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label} className="bg-night p-6 text-center sm:p-7">
                <dt className="text-xl font-extrabold tracking-tight text-gold sm:text-2xl">
                  {d.label}
                </dt>
                <dd className="mt-2 text-balance text-lg leading-relaxed text-drift">
                  {d.body}
                  {d.sub && <span className="mt-0.5 block text-base">{d.sub}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mx-auto mt-10 w-full max-w-md" data-cta>
            <CtaButton onClick={scrollToRegister}>שריין את המקום שלי בוובינר ←</CtaButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
