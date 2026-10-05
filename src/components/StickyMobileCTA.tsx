import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToRegister } from "../lib/site";

/**
 * Mobile-only bottom CTA. Shown only on the stretch between the hero and the
 * form: hidden at the top, hidden once the form reaches the screen (and for
 * the rest of the page, so it never covers the form or the footer), and
 * hidden while an inline CTA ([data-cta]) is visible to avoid duplicates.
 */
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScreen = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };
    const update = () => {
      const register = document.getElementById("register");
      const formBelowScreen = register ? register.getBoundingClientRect().top > window.innerHeight : true;
      const inlineCtaVisible = Array.from(document.querySelectorAll("[data-cta]")).some(onScreen);
      setVisible(window.scrollY > 640 && formBelowScreen && !inlineCtaVisible);
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
          className="fixed inset-x-0 bottom-0 z-50 border-t border-drift/15 bg-night/90 p-3 backdrop-blur-xl lg:hidden"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <motion.button
            type="button"
            onClick={scrollToRegister}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3.5 text-lg font-bold tracking-tight text-night shadow-cta transition-colors hover:bg-[#ffca82]"
          >
            שריין מקום בוובינר ←
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
