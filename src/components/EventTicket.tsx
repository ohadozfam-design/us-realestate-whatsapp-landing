import { BadgeCheck, CalendarDays, Ticket, Video } from "lucide-react";
import { SITE } from "../lib/site";

/** Uneven bar widths read as a barcode; purely decorative. */
const TICKET_ID = "K2-1013";

const BARCODE =
  "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 4px, currentColor 4px 7px, transparent 7px 9px, currentColor 9px 10px, transparent 10px 13px, currentColor 13px 15px, transparent 15px 16px)";

/** Boarding-pass style "ticket" for the thank-you page. */
export default function EventTicket() {
  return (
    <div className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-l from-[#1e2c35] to-[#172129] ring-1 ring-gold/30 md:flex">
      {/* Main section */}
      <div className="min-w-0 flex-1 p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-bold tracking-normal text-gold">
            <Ticket className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
            <span>כרטיס כניסה אישי</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-bold text-emerald-300 ring-1 ring-emerald-400/30">
            <BadgeCheck className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
            כרטיס מאושר
          </span>
        </div>

        <p className="mt-5 text-balance text-2xl font-extrabold leading-[1.2] tracking-tight text-cloud sm:text-3xl">
          וובינר מנוע העסקאות
        </p>

        <dl className="mt-6 grid min-w-0 gap-5">
          <div>
            <dt className="text-sm font-bold tracking-normal text-drift">מועד</dt>
            <dd className="mt-1.5 flex items-start gap-2 text-lg font-bold text-cloud">
              <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={2.2} aria-hidden="true" />
              <span>
                {SITE.eventDay}, {SITE.eventDate} {SITE.eventYear}
                <span className="block text-base font-semibold text-drift">
                  <span className="ltr-nums">{SITE.startTime} - {SITE.endTime}</span> (שעון ישראל)
                </span>
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold tracking-normal text-drift">פורמט</dt>
            <dd className="mt-1.5 flex items-start gap-2 text-lg font-bold text-cloud">
              <Video className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={2.2} aria-hidden="true" />
              <span>שידור חי בזום</span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Tear-off stub: dashed edge + punched notches (page-colored circles) */}
      <div className="relative border-t-2 border-dashed border-drift/25 p-5 sm:p-7 md:w-40 md:shrink-0 md:border-r-2 md:border-t-0 md:p-5">
        <span className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-night" aria-hidden="true" />
        <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-night md:hidden" aria-hidden="true" />
        <span className="absolute -bottom-4 -right-4 hidden h-8 w-8 rounded-full bg-night md:block" aria-hidden="true" />

        <div className="flex h-full flex-col justify-center gap-3 text-center">
          <div
            className="mx-auto h-14 w-full max-w-[12rem] text-cloud/80"
            style={{ backgroundImage: BARCODE }}
            aria-hidden="true"
          />
          <div>
            <div className="text-sm font-bold tracking-normal text-drift">מספר כרטיס</div>
            <div className="ltr-nums mt-1 font-mono text-lg font-bold tracking-widest text-gold">
              {TICKET_ID}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
