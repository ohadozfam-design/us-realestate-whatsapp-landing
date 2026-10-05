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
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gold" aria-hidden="true" />
          וובינר לייב בזום
        </motion.div>

        {/* Centered headline - stretches across the width on desktop */}
        <motion.h1
          variants={item}
          id="hero-heading"
          className="mx-auto mt-7 w-full max-w-5xl text-center font-extrabold leading-[1.15] text-balance tracking-tight text-cloud text-4xl sm:text-5xl lg:text-6xl"
        >
          {headlineBefore}
          {/* Non-breaking spaces keep the gold phrase on one line */}
          <span className="text-gold">{SITE.headlineAccent.replace(/ /g, "\u00A0")}</span>
          {headlineAfter}
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

        {/* Date + hours: one row on desktop; wraps into two tidy centred rows on mobile */}
        <motion.div
          variants={item}
          className="mx-auto mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-3.5 sm:px-6 sm:py-4"
        >
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-5 w-5 shrink-0 text-gold sm:h-6 sm:w-6" strokeWidth={2.2} aria-hidden="true" />
            <span className="whitespace-nowrap text-xl font-extrabold text-gold sm:text-3xl">
              {SITE.eventDay}, {SITE.eventDate}
            </span>
          </span>
          <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="text-lg font-bold text-cloud sm:text-xl">
              <span className="ltr-nums">{SITE.startTime}</span> עד <span className="ltr-nums">{SITE.endTime}</span>
            </span>
            <span className="text-sm font-semibold text-drift sm:text-base">(שעון ישראל)</span>
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} className="mx-auto mt-8 w-full max-w-md" data-cta>
          <CtaButton onClick={scrollToRegister}>שריין את המקום שלי בוובינר ←</CtaButton>
          <p className="mt-4 text-balance text-base text-drift">
            100% חינם · ללא כרטיס אשראי · מספר המקומות מוגבל
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
