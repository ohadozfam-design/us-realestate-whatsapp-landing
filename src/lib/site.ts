// Central place for editable event copy.
// Swap the placeholders below with the real event details before launch.

export const SITE = {
  // Main headline (hero, <title>, og/twitter tags and og-cover.jpg mirror it).
  // headlineAccent is the part of the headline rendered in gold.
  headline: "איך לקנות נדל״ן בארה״ב בצורה עקבית ורציפה בכל חודש",
  headlineAccent: "בצורה עקבית ורציפה",
  // One live session: Tuesday 13 October 2026, 18:00-19:00 Israel time.
  eventDate: "13 באוקטובר",
  eventDay: "יום שלישי",
  eventYear: "2026",
  eventHours: "18:00 עד 19:00 (שעון ישראל)",
  eventFormat: "שידור לייב אחד בזום · שעה אחת",
  eventFormatShort: "שעה אחת בלייב בזום",
  // iso + start/end (Israel local time) feed the "add to Google Calendar" link.
  iso: "2026-10-13",
  startTime: "18:00",
  endTime: "19:00",
  timeZone: "Asia/Jerusalem",
} as const;

export const scrollToRegister = () => {
  const el = document.getElementById("register");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};
