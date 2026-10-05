import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import CtaButton from "./ui/CtaButton";
import { SITE, scrollToRegister } from "../lib/site";

// Staggered entrance: badge, H1, subheadline, and CTA fade in + slide up on load.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-5 pb-16 pt-14 sm:pt-20 md:pb-24"
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
          className="inline-flex items-center gap-2.5 rounded-full border border-drift/25 bg-cloud/[0.04] px-6 py-2.5 text-lg font-bold text-cloud"
        >
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          וובינר לייב בזום
        </motion.div>

        {/* Centered headline - stretches across the width on desktop */}
        <motion.h1
          variants={item}
          id="hero-heading"
          className="mx-auto mt-7 w-full max-w-5xl text-center font-extrabold leading-[1.15] sm:leading-[1.1] text-balance tracking-tight text-cloud text-4xl sm:text-5xl lg:text-6xl"
        >
          <span className="text-gold">בשעה אחת בלייב</span> נקים מנוע עסקאות שיסגור
          לך 2 עסקאות בחודש
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-balance text-xl leading-relaxed text-drift sm:text-2xl"
        >
          <span className="block">בלי לנחש מספרים, בלי להסתמך על מזל,</span>
          <span className="block">
            בלי להתפזר{" "}
            <strong className="font-extrabold text-cloud">ובלי לשרוף שעות בזילו.</strong>
          </span>
        </motion.p>

        {/* Prominent dates + hours */}
        <motion.div
          variants={item}
          className="mx-auto mt-9 flex flex-col items-center gap-1.5 rounded-2xl border border-gold/40 bg-gold/10 px-6 py-4 sm:flex-row sm:gap-3"
        >
          <span className="inline-flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 shrink-0 text-gold" strokeWidth={2.2} aria-hidden="true" />
            <span className="text-2xl font-extrabold text-gold sm:text-3xl">
              {SITE.eventDay}, {SITE.eventDate}
            </span>
          </span>
          <span className="hidden text-gold/40 sm:block" aria-hidden="true">
            |
          </span>
          <span className="text-lg font-bold text-cloud sm:text-xl">
            <span className="ltr-nums">{SITE.startTime}</span> עד <span className="ltr-nums">{SITE.endTime}</span>
          </span>
          <span className="text-base font-semibold text-drift">(שעון ישראל)</span>
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} className="mx-auto mt-8 w-full max-w-md">
          <CtaButton onClick={scrollToRegister}>
            שריין את המקום שלי בוובינר
          </CtaButton>
          <p className="mt-4 text-lg text-drift">
            100% חינם · ללא כרטיס אשראי · ללא התחייבות
          </p>
          <p className="mt-2 text-base font-semibold text-coral">
            המקומות מוגבלים כדי לשמור על סשן שאלות ותשובות אישי בלייב.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
