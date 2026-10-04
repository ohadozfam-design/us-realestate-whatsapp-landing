import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { scrollToRegister } from "../lib/site";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
            <Lock className="h-[18px] w-[18px]" strokeWidth={2.5} aria-hidden="true" />
            שריין מקום בסדנה
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
