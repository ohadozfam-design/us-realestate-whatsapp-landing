import { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import ValueSection from "./components/ValueSection";
import RegistrationSection from "./components/RegistrationSection";
import StickyMobileCTA from "./components/StickyMobileCTA";
import ThankYouPage from "./components/ThankYouPage";
import { initTracking, trackPurchase } from "./lib/track";

// Stripe's success_url redirects to /thank-you. We also accept the legacy
// ?checkout=success query param so older/cached checkout links keep working.
function isThankYouRoute() {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.replace(/\/+$/, "");
  if (path === "/thank-you") return true;
  return new URLSearchParams(window.location.search).get("checkout") === "success";
}

export default function App() {
  const [bumpSelected, setBumpSelected] = useState(false);
  const [thankYou] = useState(isThankYouRoute);

  // Analytics: page_view (once/session) + scroll-depth and time-on-page listeners.
  // The thank-you page skips session analytics (so post-purchase visits don't
  // skew landing metrics) and only fires the Meta Pixel Purchase event.
  useEffect(() => {
    if (thankYou) {
      trackPurchase();
      return;
    }
    return initTracking();
  }, [thankYou]);

  if (thankYou) return <ThankYouPage />;

  return (
    <div className="relative min-h-screen">
      <main className="pb-24 lg:pb-0">
        <HeroSection />
        <ValueSection />
        <RegistrationSection bumpSelected={bumpSelected} onToggle={setBumpSelected} />
      </main>

      <footer className="px-5 py-10 text-center">
        <p className="text-lg font-extrabold tracking-tight text-cloud">
          סדנת מנוע העסקאות ל2 נכסים בחודש
        </p>
        <p className="mt-1 text-sm font-semibold text-drift">עם אוהד עוז</p>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-drift">
          כל הזכויות שמורות · הסדנה הינה תוכן חינוכי ופרקטי ואינה מהווה ייעוץ
          השקעות, ייעוץ מס או ייעוץ משפטי. תוצאות עשויות להשתנות בהתאם ליישום בפועל.
        </p>
      </footer>

      <StickyMobileCTA />
    </div>
  );
}
