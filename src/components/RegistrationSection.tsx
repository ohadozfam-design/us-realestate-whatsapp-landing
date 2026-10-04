import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldCheck, Lock, AlertCircle, CalendarDays, Users } from "lucide-react";
import CtaButton from "./ui/CtaButton";
import { PRICING, SITE } from "../lib/site";
import { trackCtaClick } from "../lib/track";

// Direct WhatsApp question link (972 = Israel; local 0542689675).
const WHATSAPP_HREF =
  "https://wa.me/972542689675?text=" +
  encodeURIComponent('היי אוהד, יש לי שאלה לגבי הסדנה להגשת הצעות מחיר בנדל"ן בארה"ב:');

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.447h.005c6.585 0 11.946-5.359 11.949-11.945a11.821 11.821 0 00-3.49-8.418" />
    </svg>
  );
}

type Props = {
  bumpSelected: boolean;
  onToggle: (v: boolean) => void;
};

type Lead = { name: string; phone: string; email: string };
type FieldErrors = Partial<Record<keyof Lead, string>>;

function validateLead(lead: Lead): FieldErrors {
  const errs: FieldErrors = {};
  if (lead.name.trim().length < 2) errs.name = "נא למלא שם מלא";
  if (lead.phone.replace(/\D/g, "").length < 9) errs.phone = "נא למלא מספר טלפון תקין";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) errs.email = "נא למלא כתובת אימייל תקינה";
  return errs;
}

export default function RegistrationSection({ bumpSelected, onToggle }: Props) {
  const total = bumpSelected ? PRICING.withBump : PRICING.base;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lead, setLead] = useState<Lead>({ name: "", phone: "", email: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  // Sold-out is driven ONLY by the backend cap (a 403 on checkout) - the UI never
  // fetches or displays exact seat figures, only an evergreen scarcity badge.
  const [soldOut, setSoldOut] = useState(false);

  function setField(key: keyof Lead, value: string) {
    setLead((prev) => ({ ...prev, [key]: value }));
    if (showErrors) {
      setFieldErrors(validateLead({ ...lead, [key]: value }));
    }
  }

  function paymentLinkFallback(): string | undefined {
    const base = import.meta.env.VITE_STRIPE_PAYMENT_URL_BASE;
    const bump = import.meta.env.VITE_STRIPE_PAYMENT_URL_BUMP;
    return bumpSelected ? bump || base : base;
  }

  async function handleCheckout() {
    // Validate the lead details before allowing submission.
    const errs = validateLead(lead);
    if (Object.keys(errs).length > 0) {
      setShowErrors(true);
      setFieldErrors(errs);
      setError("נא למלא שם מלא, טלפון ואימייל כדי להמשיך.");
      const firstInvalid = (["name", "phone", "email"] as (keyof Lead)[]).find((k) => errs[k]);
      if (firstInvalid) document.getElementById(`lead-${firstInvalid}`)?.focus();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Analytics: record the checkout CTA click right before opening Stripe.
    // Fire-and-forget (sendBeacon) - never blocks the redirect.
    trackCtaClick();

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hasOrderBump: bumpSelected,
          name: lead.name.trim(),
          phone: lead.phone.trim(),
          email: lead.email.trim(),
        }),
      });

      // Read as text first so a non-JSON response (e.g. an HTML SPA fallback that
      // means the /api route wasn't hit) can be logged instead of silently swallowed.
      const rawBody = await res.text();
      let data: { url?: string; error?: string; soldOut?: boolean } = {};
      try {
        data = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        throw new Error(
          `Non-JSON response from /api/create-checkout-session (status ${res.status}). ` +
            `First bytes: ${rawBody.slice(0, 120)}`
        );
      }

      // Backend seat cap reached -> switch to the sold-out waitlist (no numbers).
      if (res.status === 403 || data.soldOut) {
        setSoldOut(true);
        setIsSubmitting(false);
        return;
      }

      if (!res.ok || !data.url) {
        throw new Error(data.error || `Checkout API failed with status ${res.status}.`);
      }

      // Redirect to Stripe's hosted Checkout page.
      window.location.href = data.url;
    } catch (err) {
      console.error("[checkout] create-checkout-session failed:", err);

      const fallbackUrl = paymentLinkFallback();
      if (fallbackUrl) {
        console.warn("[checkout] falling back to Stripe Payment Link:", fallbackUrl);
        window.location.href = fallbackUrl;
        return;
      }

      setError("אירעה שגיאה במעבר לתשלום. אנא נסה שוב בעוד רגע.");
      setIsSubmitting(false);
    }
  }

  return (
    <section id="register" className="scroll-mt-6 px-5 py-16 md:py-24" aria-labelledby="checkout-heading">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Guarantee - relocated here, right above the pricing */}
        <div className="rounded-2xl border border-drift/15 bg-ateneo/25 p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
            <ShieldCheck
              className="mx-auto h-11 w-11 shrink-0 text-gold sm:mx-0"
              strokeWidth={1.6}
              aria-hidden="true"
            />
            <div className="text-center sm:text-right">
              <h2 className="text-2xl font-extrabold tracking-tight text-cloud sm:text-3xl">
                אחריות 100% שביעות רצון
              </h2>
              <p className="mt-3 max-w-2xl text-xl leading-relaxed text-cloud/85">
                „אם תשתתף בסדנה ותרגיש שלא קיבלת לפחות פי 10 מערך ההשקעה שלך, שלח
                הודעה עד 24 שעות מסיום הסדנה וקבל בחזרה את מלוא הסכום ששילמת
                (<span className="ltr-nums font-bold text-gold">${PRICING.base}</span>).”
              </p>
            </div>
          </div>
        </div>

        <figure className="overflow-hidden rounded-2xl border border-gold/30 bg-cloud/[0.04] p-4 shadow-card sm:p-6">
          <figcaption className="mb-4 text-center">
            <p className="text-sm font-bold text-gold">בוגר הסדנה מספר</p>
            <blockquote className="mt-2 text-balance text-2xl font-extrabold leading-snug text-cloud sm:text-3xl">
              ״זה סדנא של 400 דולר פלוס״
            </blockquote>
          </figcaption>
          <a
            href="/case-studies/case-1.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring block overflow-hidden rounded-xl"
            aria-label="פתיחת עדות הבוגר בגודל מלא"
          >
            <img
              src="/case-studies/case-1.jpg"
              width={1044}
              height={340}
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
              alt="הודעת בוגר בוואטסאפ: זה סדנא של 400 דולר פלוס, היה מטורף"
            />
          </a>
          <p className="mt-3 text-center text-sm text-drift">לחצו על התמונה לצפייה בגודל מלא</p>
        </figure>

        {/* Checkout card */}
        <div
          className="overflow-hidden rounded-2xl border border-drift/15 bg-ateneo/15 shadow-card"
        >
          {/* header */}
          <div className="border-b border-drift/10 px-6 py-7 text-center sm:px-8">
            <span className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
              שריון מקום לסדנה
            </span>
            <h2
              id="checkout-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-cloud sm:text-4xl"
            >
              סיכום ההזמנה שלך
            </h2>
            {/* Dates + live seat status - stacked with clean breathing room */}
            <div className="mt-6 flex flex-col items-center gap-3.5">
              {/* Prominent dates + hours badge */}
              <div className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border border-gold/30 bg-gold/10 px-5 py-2 text-lg font-bold text-gold">
                <CalendarDays className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                <span>{SITE.eventDates}</span>
                <span className="text-gold/50" aria-hidden="true">|</span>
                <span>
                  <span className="ltr-nums">18:00</span> עד <span className="ltr-nums">20:00</span>
                </span>
                <span className="text-base font-semibold text-gold/80">(שעון ישראל)</span>
              </div>

              {soldOut ? (
                <p className="inline-flex items-center gap-2 rounded-full bg-coral/15 px-4 py-1.5 text-lg font-extrabold text-coral">
                  <Users className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                  הסדנה בתפוסה מלאה
                </p>
              ) : (
                <p className="inline-flex items-center gap-2 rounded-full bg-coral/15 px-4 py-1.5 text-base font-extrabold text-coral sm:text-lg">
                  <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral" />
                  </span>
                  מספר המקומות מוגבל - נותרו מקומות אחרונים
                </p>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {soldOut ? (
              <SoldOutWaitlist />
            ) : (
              <>
            <div className="space-y-3">
              <LineItem
                label="כרטיס לסדנה הלייב · יומיים בלייב"
                price={`$${PRICING.base}`}
              />
              <AnimatePresence initial={false}>
                {bumpSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LineItem label="Off Market & Contractor Pack" price="$27" accent />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ---- Order bump (native, keyboard-accessible checkbox) ---- */}
            <div className="my-6">
              <input
                id="order-bump"
                type="checkbox"
                checked={bumpSelected}
                onChange={(e) => onToggle(e.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor="order-bump"
                className={`relative flex cursor-pointer items-start gap-3 rounded-xl border-2 border-dashed p-4 pt-5 text-right transition-colors duration-300 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-night ${
                  bumpSelected
                    ? "border-gold bg-night/50"
                    : "border-gold/50 bg-night/30 hover:bg-night/45"
                }`}
              >
                <span
                  className="absolute -top-px right-4 -translate-y-1/2 rounded-md bg-coral px-2 py-0.5 text-xs font-extrabold text-night"
                  aria-hidden="true"
                >
                  הצעה חד פעמית שלא תחזור
                </span>

                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 ${
                    bumpSelected ? "border-gold bg-gold text-night" : "border-gold/70 bg-transparent"
                  }`}
                  aria-hidden="true"
                >
                  {bumpSelected && <Check className="h-4 w-4" strokeWidth={3.5} />}
                </span>
                <span className="text-xl leading-relaxed text-cloud">
                  <span className="font-bold">כן! הוסף להזמנה שלי</span> את חבילת החוזים לעבודה מול
                  קבלנים ומוכרים פרטיים{" "}
                  <span className="font-semibold text-gold">(Off Market &amp; Contractor Pack)</span>{" "}
                  תמורת <span className="ltr-nums font-bold">$27</span> בלבד{" "}
                  <span className="text-drift">
                    (במקום <span className="ltr-nums line-through">${PRICING.bumpOriginal}</span>).
                  </span>
                </span>
              </label>
            </div>

            {/* ---- Lead capture form ---- */}
            <div className="rounded-xl border border-drift/15 bg-night/40 p-5 sm:p-6">
              <h3 className="text-base font-bold uppercase tracking-[0.15em] text-gold">הפרטים שלך</h3>
              <p className="mt-1 text-base text-drift">
                כדי לשמור לך את המקום ולשלוח את הקישור לזום ואת כל החומרים.
              </p>
              <div className="mt-4 space-y-3.5">
                <Field
                  id="lead-name"
                  label="שם מלא"
                  value={lead.name}
                  onChange={(v) => setField("name", v)}
                  autoComplete="name"
                  placeholder="ישראל ישראלי"
                  error={showErrors ? fieldErrors.name : undefined}
                />
                <Field
                  id="lead-phone"
                  label="טלפון / וואטסאפ"
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  value={lead.phone}
                  onChange={(v) => setField("phone", v)}
                  autoComplete="tel"
                  placeholder="050 000 0000"
                  error={showErrors ? fieldErrors.phone : undefined}
                />
                <Field
                  id="lead-email"
                  label="כתובת אימייל"
                  type="email"
                  inputMode="email"
                  dir="ltr"
                  value={lead.email}
                  onChange={(v) => setField("email", v)}
                  autoComplete="email"
                  placeholder="name@email.com"
                  error={showErrors ? fieldErrors.email : undefined}
                />
              </div>
            </div>

            {/* ---- Total ---- */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cloud/10 bg-night/50 px-5 py-4">
              <span className="text-lg font-bold text-cloud">סה״כ לתשלום היום</span>
              <div
                className="relative min-h-[3.25rem] shrink-0 overflow-visible text-left"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                aria-label={`סך הכל לתשלום: ${total} דולר`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={total}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="ltr-nums block text-5xl font-extrabold tracking-tight text-gold"
                  >
                    ${total}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* ---- CTA ---- */}
            <div className="mt-6">
              <CtaButton
                onClick={handleCheckout}
                loading={isSubmitting}
                aria-label={`שריין את מקומי בסדנה עכשיו בעלות של ${total} דולר`}
              >
                {isSubmitting ? (
                  "מעבירים אותך לתשלום מאובטח…"
                ) : (
                  <>
                    שריין את מקומי בסדנה עכשיו · <span className="ltr-nums">${total}</span>
                  </>
                )}
              </CtaButton>

              {error && (
                <p
                  role="alert"
                  className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-coral/40 bg-coral/10 px-4 py-2.5 text-base font-semibold text-coral"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                  {error}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-base text-drift">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" /> החזר כספי מלא 100%
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-gold" aria-hidden="true" /> תשלום מאובטח
                </span>
              </div>

              {/* Direct WhatsApp question link */}
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-5 flex items-center justify-center gap-2.5 rounded-xl border border-drift/15 bg-cloud/[0.02] px-4 py-3.5 text-center text-base font-semibold text-drift transition-colors hover:border-[#25D366]/60 hover:text-cloud"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#25D366]" />
                יש לך שאלה לפני ההרשמה? שלח לי הודעה ישירה בוואטסאפ
              </a>
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SoldOutWaitlist() {
  const [lead, setLead] = useState<Lead>({ name: "", phone: "", email: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(key: keyof Lead, value: string) {
    setLead((prev) => ({ ...prev, [key]: value }));
    if (showErrors) setFieldErrors(validateLead({ ...lead, [key]: value }));
  }

  async function submit() {
    const errs = validateLead(lead);
    if (Object.keys(errs).length > 0) {
      setShowErrors(true);
      setFieldErrors(errs);
      setError("נא למלא שם מלא, טלפון ואימייל תקינים.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name.trim(),
          phone: lead.phone.trim(),
          email: lead.email.trim(),
          source: "sold_out",
        }),
      });
      if (!r.ok) throw new Error(`waitlist failed (${r.status})`);
      setSubmitted(true);
    } catch (err) {
      console.error("[waitlist] submit failed:", err);
      setError("אירעה שגיאה. נסה שוב בעוד רגע.");
      setSubmitting(false);
    }
  }

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-coral/40 bg-coral/10 px-4 py-1.5 text-base font-extrabold text-coral">
        <Users className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
        תפוסה מלאה
      </div>
      <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-cloud sm:text-3xl">
        כל המקומות למחזור הזה נתפסו
      </h3>
      <p className="mx-auto mt-3 max-w-lg text-lg leading-relaxed text-drift">
        הצטרף לרשימת ההמתנה ונעדכן אותך מיד אם יתפנה מקום, או ראשונים לקראת
        המחזור הבא.
      </p>

      {submitted ? (
        <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-7 text-center">
          <p className="text-2xl font-extrabold text-cloud">נרשמת לרשימת ההמתנה!</p>
          <p className="mt-2 text-lg text-drift">נהיה בקשר ברגע שמתפנה מקום.</p>
        </div>
      ) : (
        <div className="mt-6 text-right">
          <div className="rounded-xl border border-drift/15 bg-night/40 p-5 sm:p-6">
            <h4 className="text-center text-base font-bold uppercase tracking-[0.15em] text-gold">
              רשימת המתנה
            </h4>
            <div className="mt-4 space-y-3.5">
              <Field
                id="wl-name"
                label="שם מלא"
                value={lead.name}
                onChange={(v) => setField("name", v)}
                autoComplete="name"
                placeholder="ישראל ישראלי"
                error={showErrors ? fieldErrors.name : undefined}
              />
              <Field
                id="wl-phone"
                label="טלפון / וואטסאפ"
                type="tel"
                inputMode="tel"
                dir="ltr"
                value={lead.phone}
                onChange={(v) => setField("phone", v)}
                autoComplete="tel"
                placeholder="050 000 0000"
                error={showErrors ? fieldErrors.phone : undefined}
              />
              <Field
                id="wl-email"
                label="כתובת אימייל"
                type="email"
                inputMode="email"
                dir="ltr"
                value={lead.email}
                onChange={(v) => setField("email", v)}
                autoComplete="email"
                placeholder="name@email.com"
                error={showErrors ? fieldErrors.email : undefined}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="focus-ring mt-5 w-full rounded-full bg-gold px-6 py-4 text-lg font-bold text-night shadow-cta transition-colors hover:bg-[#ffca82] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "רושמים אותך…" : "הוסף אותי לרשימת ההמתנה"}
          </button>

          {error && (
            <p
              role="alert"
              className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-coral/40 bg-coral/10 px-4 py-2.5 text-base font-semibold text-coral"
            >
              <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  dir,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  dir?: "rtl" | "ltr";
  autoComplete?: string;
  placeholder?: string;
}) {
  const invalid = Boolean(error);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-base font-semibold text-cloud">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        dir={dir}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={`focus-ring w-full rounded-xl border bg-night/60 px-4 py-3 text-lg text-cloud placeholder:text-drift/60 transition-colors ${
          invalid ? "border-coral" : "border-drift/50 hover:border-drift/70"
        }`}
      />
      {invalid && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-coral">
          {error}
        </p>
      )}
    </div>
  );
}

function LineItem({
  label,
  price,
  accent = false,
}: {
  label: string;
  price: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
        accent ? "border-gold/40 bg-gold/10" : "border-cloud/10 bg-night/40"
      }`}
    >
      <span className="pe-3 text-base font-semibold text-cloud">{label}</span>
      <span className="ltr-nums shrink-0 text-base font-bold text-cloud">{price}</span>
    </div>
  );
}
