import { motion } from "framer-motion";
import WhatsAppButton from "./ui/WhatsAppButton";
import { SITE } from "../lib/site";

// Staggered entrance: badge, H1, subheadline, and CTA fade in + slide up on load.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const [headlineBefore, headlineAfter] = SITE.headline.split(SITE.headlineAccent);

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-5 py-12 md:py-20"
      aria-labelledby="hero-heading"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-5xl flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2.5 rounded-full border border-drift/15 bg-cloud/[0.04] px-6 py-2.5 text-lg font-bold text-cloud"
        >
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#25D366]" aria-hidden="true" />
          קהילה סגורה · הצטרפות חינם
        </motion.div>

        {/* Centered headline - stretches across the width on desktop */}
        <motion.h1
          variants={item}
          id="hero-heading"
          className="mx-auto mt-7 w-full max-w-5xl text-center font-extrabold leading-[1.15] text-balance tracking-tight text-cloud text-4xl sm:text-5xl lg:text-6xl"
        >
          {headlineBefore}
          <span className="text-gold">{SITE.headlineAccent}</span>
          {headlineAfter}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-balance text-xl leading-relaxed text-drift sm:text-2xl"
        >
          עסקאות אמיתיות, ניתוחי נכסים, שאלות ותשובות וקשרים עם אנשי מקצוע בשטח.{" "}
          <strong className="font-extrabold text-cloud">הכול בקבוצה אחת.</strong>
        </motion.p>

        {/* CTA */}
        <motion.div variants={item} className="mx-auto mt-9 w-full max-w-md" data-cta>
          <WhatsAppButton location="hero">הצטרפות לקהילה בחינם ←</WhatsAppButton>
          <p className="mt-4 text-balance text-base text-drift">
            לחיצה אחת · בלי טפסים · יוצאים מתי שרוצים
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
