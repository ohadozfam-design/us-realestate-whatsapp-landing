import { Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type CtaButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  showLock?: boolean;
  size?: "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
};

export default function CtaButton({
  children,
  onClick,
  type = "button",
  className = "",
  showLock = true,
  size = "lg",
  loading = false,
  disabled = false,
  "aria-label": ariaLabel,
}: CtaButtonProps) {
  const pad = size === "lg" ? "px-8 py-[17px] text-lg sm:text-xl" : "px-5 py-3 text-base";
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { y: -2 }}
      whileTap={isDisabled ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className={`focus-ring inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gold font-bold tracking-tight text-night shadow-cta transition-colors duration-200 hover:bg-[#ffca82] ${pad} ${
        isDisabled ? "cursor-not-allowed opacity-70" : ""
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="h-[18px] w-[18px] shrink-0 animate-spin" strokeWidth={2.4} aria-hidden="true" />
      ) : (
        showLock && (
          <Lock className="h-[17px] w-[17px] shrink-0" strokeWidth={2.4} aria-hidden="true" />
        )
      )}
      <span>{children}</span>
    </motion.button>
  );
}
