import { motion } from "framer-motion";
import type { ReactNode } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import { WHATSAPP_GROUP_URL } from "../../lib/site";
import { trackJoinWhatsApp } from "../../lib/track";

type WhatsAppButtonProps = {
  children: ReactNode;
  /** Where on the page the button sits (hero / bottom / sticky); sent with the event. */
  location: string;
  className?: string;
};

/**
 * The single conversion action: an oversized WhatsApp-green link to the
 * community, so it works without JS and supports long-press / open-in-new-tab.
 * The click fires the ad-tag events before the browser follows the link.
 * On narrow phones the label wraps to two balanced lines instead of shrinking.
 */
export default function WhatsAppButton({ children, location, className = "" }: WhatsAppButtonProps) {
  return (
    <motion.a
      href={WHATSAPP_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackJoinWhatsApp(location)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className={`focus-ring flex w-full items-center justify-center gap-3 rounded-3xl bg-wa-button px-6 py-5 text-xl font-extrabold leading-tight tracking-tight text-white shadow-wa transition-[background-color,box-shadow] duration-200 hover:bg-wa-dark hover:shadow-wa-hover sm:gap-4 sm:rounded-full sm:px-10 sm:py-6 sm:text-2xl lg:text-3xl ${className}`}
    >
      <WhatsAppIcon className="h-9 w-9 shrink-0 sm:h-10 sm:w-10 lg:h-11 lg:w-11" />
      <span className="text-balance text-center">{children}</span>
    </motion.a>
  );
}
