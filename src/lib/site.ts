// Central place for editable event copy.
// Swap the placeholders below with the real event details before launch.

export const SITE = {
  // Two concentrated days, two live hours each (18:00 to 20:00 Israel time).
  // Two concentrated days: 6 October (day 1) and 7 October (day 2), 2026.
  eventDates: "6 & 7 באוקטובר",
  eventHours: "18:00 עד 20:00 (שעון ישראל)",
  eventDatesFull: "6 & 7 באוקטובר · 18:00 עד 20:00 (שעון ישראל)",
  eventFormat: "יומיים מרוכזים · שעתיים בכל יום בלייב בזום",
  eventFormatShort: "יומיים בלייב בזום · שעתיים בכל יום",
  day1: { date: "6 באוקטובר", label: "יום שלישי" },
  day2: { date: "7 באוקטובר", label: "יום רביעי" },
} as const;

export const scrollToRegister = () => {
  const el = document.getElementById("register");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};
