import { useState, type FormEvent } from "react";
import { Check, ShieldCheck, AlertCircle, CalendarDays } from "lucide-react";
import CtaButton from "./ui/CtaButton";
import WhatsAppIcon from "./ui/WhatsAppIcon";
import { SITE } from "../lib/site";
import { trackRegistration } from "../lib/track";

// Direct WhatsApp question link (972 = Israel; local 0542689675).
const WHATSAPP_HREF =
  "https://wa.me/972542689675?text=" +
  encodeURIComponent('היי אוהד, יש לי שאלה לגבי הוובינר להגשת הצעות מחיר בנדל"ן בארה"ב:');

const CONSENT_LABEL = "אני מאשר/ת קבלת תזכורות לוובינר, עדכונים ותכנים במייל וב-WhatsApp";

type Lead = { name: string; email: string; phone: string };
type LeadPayload = Lead & { marketingConsent: true; submittedAt: string };
type FieldErrors = Partial<Record<keyof Lead | "consent", string>>;

function validate(lead: Lead, consent: boolean): FieldErrors {
  const errs: FieldErrors = {};
  if (lead.name.trim().length < 2) errs.name = "נא למלא שם מלא";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email.trim())) {
    errs.email = "נא למלא כתובת אימייל תקינה";
  }
  // Israeli or international: digits with optional +, spaces, dashes, parentheses.
  const phone = lead.phone.trim();
  const digits = phone.replace(/\D/g, "").length;
  if (!/^\+?[\d\s\-().]+$/.test(phone) || digits < 9 || digits > 15) {
    errs.phone = "נא למלא מספר טלפון תקין";
  }
  if (!consent) errs.consent = "יש לאשר קבלת תזכורות כדי שנוכל לשלוח לך את הקישור לוובינר";
  return errs;
}

/** POST the lead to VITE_LEAD_WEBHOOK_URL, or log it when no webhook is configured. */
async function submitLead(payload: LeadPayload): Promise<void> {
  const url = import.meta.env.VITE_LEAD_WEBHOOK_URL;
  if (!url) {
    console.info("[lead] VITE_LEAD_WEBHOOK_URL is not set - registration payload:", payload);
    return;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Lead webhook failed with status ${res.status}`);
}

const FIELD_ORDER: (keyof FieldErrors)[] = ["name", "email", "phone", "consent"];

export default function RegistrationSection() {
  const [lead, setLead] = useState<Lead>({ name: "", email: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(key: keyof Lead, value: string) {
    const next = { ...lead, [key]: value };
    setLead(next);
    if (showErrors) setFieldErrors(validate(next, consent));
  }

  function toggleConsent(value: boolean) {
    setConsent(value);
    if (showErrors) setFieldErrors(validate(lead, value));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    const errs = validate(lead, consent);
    if (Object.keys(errs).length > 0) {
      setShowErrors(true);
      setFieldErrors(errs);
      setError(null);
      const firstInvalid = FIELD_ORDER.find((k) => errs[k]);
      if (firstInvalid) document.getElementById(`lead-${firstInvalid}`)?.focus();
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await submitLead({
        name: lead.name.trim(),
        email: lead.email.trim(),
        phone: lead.phone.trim(),
        // Compliance record: the consent box is required, so this is always true.
        marketingConsent: true,
        submittedAt: new Date().toISOString(),
      });
      trackRegistration();
      window.location.href = "/thank-you";
    } catch (err) {
      console.error("[lead] submission failed:", err);
      setError("אירעה שגיאה בשליחת הפרטים. אנא נסה שוב בעוד רגע.");
      setIsSubmitting(false);
    }
  }

  return (
    <section id="register" className="scroll-mt-6 px-5 py-16 md:py-24" aria-labelledby="register-heading">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Trust box - free, no commitment */}
        <div className="rounded-2xl border border-drift/15 bg-ateneo/25 p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
            <ShieldCheck
              className="mx-auto h-11 w-11 shrink-0 text-gold sm:mx-0"
              strokeWidth={1.6}
              aria-hidden="true"
            />
            <div className="text-center sm:text-right">
              <h2 className="text-2xl font-extrabold tracking-tight text-cloud sm:text-3xl">
                100% חינם, בלי התחייבות
              </h2>
              <p className="mt-3 max-w-2xl text-xl leading-relaxed text-cloud/85">
                ההשתתפות בוובינר ללא עלות וללא כרטיס אשראי. ממלאים פרטים, מקבלים
                את הקישור לזום ומגיעים ללמוד.
              </p>
            </div>
          </div>
        </div>

        <figure className="overflow-hidden rounded-2xl border border-gold/30 bg-cloud/[0.04] p-4 shadow-card sm:p-6">
          <figcaption className="mb-4 text-center">
            <p className="text-sm font-bold text-gold">בוגר K2 מספר</p>
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

        {/* Opt-in card */}
        <div className="overflow-hidden rounded-2xl border border-drift/15 bg-ateneo/15 shadow-card">
          <div className="border-b border-drift/10 px-6 py-7 text-center sm:px-8">
            <span className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
              הרשמה חינמית
            </span>
            <h2
              id="register-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-cloud sm:text-4xl"
            >
              שריין את המקום שלך בוובינר
            </h2>
            <div className="mt-6 flex flex-col items-center gap-3.5">
              <div className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border border-gold/30 bg-gold/10 px-5 py-2 text-lg font-bold text-gold">
                <CalendarDays className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                <span>{SITE.eventDay}, {SITE.eventDate}</span>
                <span className="text-gold/50" aria-hidden="true">|</span>
                <span>
                  <span className="ltr-nums">{SITE.startTime}</span> עד <span className="ltr-nums">{SITE.endTime}</span>
                </span>
                <span className="text-base font-semibold text-gold/80">(שעון ישראל)</span>
              </div>
              <p className="inline-flex items-center gap-2 rounded-full bg-coral/15 px-4 py-1.5 text-base font-extrabold text-coral sm:text-lg">
                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral" />
                </span>
                מספר המקומות בזום מוגבל
              </p>
            </div>
          </div>

          <form noValidate onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="rounded-xl border border-drift/15 bg-night/40 p-5 sm:p-6">
              <h3 className="text-base font-bold uppercase tracking-[0.15em] text-gold">הפרטים שלך</h3>
              <p className="mt-1 text-base text-drift">כדי לשלוח לך את הקישור לזום ותזכורת לפני שמתחילים.</p>
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
              </div>

              {/* Marketing consent - unchecked by default, required to register */}
              <div className="mt-5">
                <label htmlFor="lead-consent" className="flex cursor-pointer items-start gap-3">
                  <input
                    id="lead-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => toggleConsent(e.target.checked)}
                    aria-invalid={showErrors && Boolean(fieldErrors.consent)}
                    aria-describedby={showErrors && fieldErrors.consent ? "lead-consent-error" : undefined}
                    className="peer sr-only"
                  />
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-night ${
                      consent
                        ? "border-gold bg-gold text-night"
                        : showErrors && fieldErrors.consent
                          ? "border-coral"
                          : "border-drift/60"
                    }`}
                    aria-hidden="true"
                  >
                    {consent && <Check className="h-4 w-4" strokeWidth={3.5} />}
                  </span>
                  <span className="text-base leading-relaxed text-cloud/90">{CONSENT_LABEL}</span>
                </label>
                {showErrors && fieldErrors.consent && (
                  <p id="lead-consent-error" className="mt-1.5 text-sm font-semibold text-coral">
                    {fieldErrors.consent}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <CtaButton type="submit" showLock={false} loading={isSubmitting}>
                {isSubmitting ? "שולחים…" : "שריין לי מקום בחינם ←"}
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
          </form>
        </div>
      </div>
    </section>
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
        name={id.replace("lead-", "")}
        type={type}
        inputMode={inputMode}
        dir={dir}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
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
