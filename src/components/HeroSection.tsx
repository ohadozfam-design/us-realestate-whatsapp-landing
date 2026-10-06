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
          className="inline-flex items-center gap-2.5 text-balance rounded-2xl border border-line bg-white/80 px-4 py-2 text-[15px] font-bold text-ink shadow-sm sm:rounded-full sm:px-6 sm:py-2.5 sm:text-lg"
        >
          <span className="hidden h-2.5 w-2.5 shrink-0 rounded-full bg-wa sm:inline-flex" aria-hidden="true" />
          {SITE.eyebrow}
        </motion.div>

        {/* Centered headline - stretches across the width on desktop */}
        <motion.h1
          variants={item}
          id="hero-heading"
          className="mx-auto mt-7 w-full max-w-5xl text-center font-extrabold leading-[1.15] text-balance tracking-tight text-ink text-4xl sm:text-5xl lg:text-6xl"
        >
          {SITE.headline}
          <span className="mt-1 block text-wa-deep">{SITE.headlineAccent}</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-balance text-xl leading-relaxed text-muted sm:text-2xl"
        >
          {SITE.subheadline}
        </motion.p>

        {/* CTA */}
        <motion.div variants={item} className="mx-auto mt-10 w-full max-w-xl lg:max-w-2xl" data-cta>
          <WhatsAppButton location="hero">{SITE.ctaLabel}</WhatsAppButton>
          <p className="mt-5 text-balance text-base font-semibold text-muted">
            {/* One line from sm up; on phones the last item drops to its own
                line (no dangling separator) under the first ones. */}
            {SITE.ctaMicrocopy.map((part, i) => {
              const last = i === SITE.ctaMicrocopy.length - 1;
              return (
                <span key={part} className={last ? "block sm:inline" : undefined}>
                  {i > 0 && <span className={last ? "hidden sm:inline" : undefined}> · </span>}
                  <span className="whitespace-nowrap">{part}</span>
                </span>
              );
            })}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
