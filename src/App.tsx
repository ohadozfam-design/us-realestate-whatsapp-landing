import { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import ValueSection from "./components/ValueSection";
import RegistrationSection from "./components/RegistrationSection";
import StickyMobileCTA from "./components/StickyMobileCTA";
import ThankYouPage from "./components/ThankYouPage";
import { initTracking, trackLead } from "./lib/track";

// The registration form redirects to /thank-you on success.
function isThankYouRoute() {
  if (typeof window === "undefined") return false;
  return window.location.pathname.replace(/\/+$/, "") === "/thank-you";
}

export default function App() {
  const [thankYou] = useState(isThankYouRoute);

  // Analytics: page_view (once/session) + scroll-depth and time-on-page listeners.
  // The thank-you page skips session analytics (so post-signup visits don't
  // skew landing metrics) and only fires the Meta Pixel Lead event.
  useEffect(() => {
    if (thankYou) {
      trackLead();
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
        <RegistrationSection />
      </main>

      <footer className="px-5 py-10 text-center">
        <p className="text-lg font-extrabold tracking-tight text-cloud">
          וובינר מנוע העסקאות ל2 נכסים בחודש
        </p>
        <p className="mt-1 text-sm font-semibold text-drift">עם אוהד עוז</p>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-drift">
          כל הזכויות שמורות · הוובינר הינו תוכן חינוכי ופרקטי ואינה מהווה ייעוץ
          השקעות, ייעוץ מס או ייעוץ משפטי. תוצאות עשויות להשתנות בהתאם ליישום בפועל.
        </p>
      </footer>

      <StickyMobileCTA />
    </div>
  );
}
