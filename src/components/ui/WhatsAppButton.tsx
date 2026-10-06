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
 * The single conversion action: a real link to the WhatsApp community, so it
 * works without JS and supports long-press / open-in-new-tab. The click fires
 * the ad-tag events before the browser follows the link.
 */
export default function WhatsAppButton({ children, location, className = "" }: WhatsAppButtonProps) {
  return (
    <motion.a
      href={WHATSAPP_GROUP_URL || undefined}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackJoinWhatsApp(location)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className={`focus-ring inline-flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-gold px-6 sm:px-8 py-[17px] text-lg font-bold tracking-tight text-night shadow-cta transition-colors duration-200 hover:bg-[#ffca82] sm:text-xl ${className}`}
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span>{children}</span>
    </motion.a>
  );
}
