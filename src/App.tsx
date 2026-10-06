import { useEffect } from "react";
import HeroSection from "./components/HeroSection";
import ShowcaseSection from "./components/ShowcaseSection";
import StickyMobileCTA from "./components/StickyMobileCTA";
import Reveal from "./components/ui/Reveal";
import WhatsAppButton from "./components/ui/WhatsAppButton";
import { SITE } from "./lib/site";
import { initTracking } from "./lib/track";

export default function App() {
  // Meta Pixel + Google Tag page views (each a no-op when its id is unset).
  useEffect(() => initTracking(), []);

  return (
    <div className="relative min-h-screen">
      <main>
        <HeroSection />
        <ShowcaseSection />

        {/* Bottom CTA */}
        <section className="px-5 py-12 md:py-20" aria-labelledby="join-heading">
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-2xl border border-drift/15 bg-ateneo/15 px-3 py-10 text-center shadow-card sm:px-10">
              <h2
                id="join-heading"
                className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-cloud sm:text-4xl"
              >
                {SITE.bottomHeadline}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-balance text-lg leading-relaxed text-drift">
                {SITE.bottomSubheadline}
              </p>
              <div className="mx-auto mt-7 w-full max-w-md" data-cta>
                <WhatsAppButton location="bottom">{SITE.ctaLabel}</WhatsAppButton>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="px-5 pb-28 pt-6 text-center lg:pb-10">
        <p className="text-sm font-semibold text-drift">{SITE.footer}</p>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-drift/70">
          התוכן בקהילה הינו חינוכי בלבד ואינו מהווה ייעוץ השקעות, ייעוץ מס או ייעוץ משפטי.
        </p>
      </footer>

      <StickyMobileCTA />
    </div>
  );
}
