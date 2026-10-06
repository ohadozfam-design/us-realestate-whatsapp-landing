import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppIcon from "./ui/WhatsAppIcon";
import { SITE, WHATSAPP_GROUP_URL } from "../lib/site";
import { trackJoinWhatsApp } from "../lib/track";

/**
 * Mobile-only bottom WhatsApp CTA. Pinned once the visitor scrolls past the
 * hero, and hidden while an inline CTA ([data-cta]) is on screen so two join
 * buttons never show at once.
 */
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScreen = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };
    const update = () => {
      const inlineCtaVisible = Array.from(document.querySelectorAll("[data-cta]")).some(onScreen);
      setVisible(window.scrollY > 200 && !inlineCtaVisible);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/90 p-3 backdrop-blur-xl lg:hidden"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <motion.a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackJoinWhatsApp("sticky")}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="focus-ring flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-wa-button px-4 py-4 text-lg font-extrabold tracking-tight text-white shadow-glow transition-colors hover:bg-wa-dark"
          >
            <WhatsAppIcon className="h-7 w-7 shrink-0" />
            {SITE.ctaLabel}
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
