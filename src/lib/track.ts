// Single-row-per-session analytics.
//
// Each visitor is ONE row in the Analytics sheet, keyed by a sessionId. The
// client keeps live session state (max scroll, CTA clicked, elapsed seconds)
// and sends "upsert" beacons to /api/track-event; the Apps Script updates the
// matching row (or appends it on first sight).
//
// Updates fire on: initial load, every new scroll milestone, the CTA click, a
// periodic heartbeat (5s, 15s, 30s, 60s, then every 30s), and page exit. We do
// NOT rely on pagehide/visibilitychange alone (mobile browsers throttle/drop
// them) - the heartbeat guarantees time-on-page keeps advancing. All sends use
// sendBeacon (keepalive fetch fallback) so nothing blocks the UI or registration.
// No cookies; only device class, UTM tags and ?phone / ?uid lead params.

type Extra = Record<string, string | number | boolean>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const SID_KEY = "k2_sid";
const ARRIVAL_KEY = "k2_arrival";
const MAXSCROLL_KEY = "k2_maxscroll";
const CTA_KEY = "k2_cta";
// Owner/admin exclusion: a persistent localStorage flag that suppresses ALL
// analytics for this browser (set once via ?admin=true / ?preview=true).
const IGNORE_KEY = "k2_ignore_analytics";

/** True when this browser is flagged to be excluded from analytics. */
function analyticsIgnored(): boolean {
  try {
    return window.localStorage.getItem(IGNORE_KEY) === "true";
  } catch {
    return false;
  }
}
const TRACK_URL = "/api/track-event";

/* ── session state (in-memory primary, sessionStorage mirror) ────────────── */

type SessionState = { id: string; arrival: string; maxScroll: number; cta: boolean };
let S: SessionState | null = null;

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function genId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through to the timestamp-random id */
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Lazily build the session state, restoring from sessionStorage when possible. */
function state(): SessionState {
  if (S) return S;
  const store = storage();
  let id = "";
  let arrival = "";
  let maxScroll = 0;
  let cta = false;
  try {
    if (store) {
      id = store.getItem(SID_KEY) || "";
      arrival = store.getItem(ARRIVAL_KEY) || "";
      maxScroll = Number(store.getItem(MAXSCROLL_KEY) || 0) || 0;
      cta = store.getItem(CTA_KEY) === "1";
    }
  } catch {
    /* storage blocked - fall back to fresh in-memory values */
  }
  if (!id) id = genId(); // ALWAYS have a non-empty sessionId
  if (!arrival) arrival = new Date().toISOString();
  S = { id, arrival, maxScroll, cta };
  mirror(SID_KEY, id);
  mirror(ARRIVAL_KEY, arrival);
  return S;
}

function mirror(key: string, value: string): void {
  try {
    storage()?.setItem(key, value);
  } catch {
    /* storage blocked - in-memory state is still authoritative */
  }
}

function elapsedSeconds(): number {
  const started = new Date(state().arrival).getTime();
  return Math.max(0, Math.round((Date.now() - started) / 1000));
}

function deviceType(): "mobile" | "desktop" {
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

/* ── payload + upsert send ──────────────────────────────────────────────── */

function buildPayload(extra?: Extra) {
  const s = state();
  const params = new URLSearchParams(window.location.search);
  return {
    sessionId: s.id, // the row key - guaranteed non-empty
    timestamp: s.arrival, // arrival time (fixed for the session)
    device: deviceType(),
    seconds: elapsedSeconds(),
    maxScroll: `${s.maxScroll}%`,
    ctaClicked: s.cta,
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    phone: params.get("phone") || "",
    uid: params.get("uid") || params.get("lead_id") || "",
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || "",
    ...extra,
  };
}

/** Fire-and-forget upsert. Prefers sendBeacon; falls back to keepalive fetch. */
function sendSession(extra?: Extra): void {
  if (typeof window === "undefined") return;
  if (analyticsIgnored()) return; // owner/admin traffic is never recorded
  try {
    const body = JSON.stringify(buildPayload(extra));
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(TRACK_URL, blob)) return;
    }
    void fetch(TRACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch (err) {
    console.error("[track] session upsert failed", err);
  }
}

/**
 * Initialize the Meta (Facebook) Pixel from VITE_META_PIXEL_ID, entirely in JS
 * (no build-time HTML env tokens). Silently no-ops when the id is unset/empty,
 * so builds never break and no bogus pixel is created.
 */
function initMetaPixel(): void {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  if (!pixelId || typeof pixelId !== "string") return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (w.fbq) {
    // Already bootstrapped - just (re)track a PageView.
    try {
      w.fbq("init", pixelId);
      w.fbq("track", "PageView");
    } catch {
      /* ignore */
    }
    return;
  }

  // Canonical Meta Pixel bootstrap (loader + queue), injected at runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const n: any = function (...args: unknown[]) {
    n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
  };
  w.fbq = n;
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const first = document.getElementsByTagName("script")[0];
  first?.parentNode?.insertBefore(script, first);

  try {
    n("init", pixelId);
    n("track", "PageView");
  } catch {
    /* ignore */
  }
}

/** Safe Meta Pixel track (no-op if the pixel isn't configured/loaded). */
function fbqTrack(event: string): void {
  try {
    window.fbq?.("track", event);
  } catch {
    /* pixel not present */
  }
}

/* ── public API ─────────────────────────────────────────────────────────── */

const LEAD_PENDING_KEY = "k2_lead_pending";

/**
 * Thank-you page: load the pixel (PageView) and fire Lead once, only when the
 * visitor arrived here by submitting the registration form (direct visits or
 * refreshes fire nothing).
 */
export function trackLead(): void {
  if (typeof window === "undefined") return;
  initMetaPixel();
  try {
    if (window.sessionStorage.getItem(LEAD_PENDING_KEY) !== "1") return;
    window.sessionStorage.removeItem(LEAD_PENDING_KEY);
  } catch {
    return;
  }
  fbqTrack("Lead");
}

/**
 * Registration submitted - mark the session row and flag the Lead pixel event
 * for the thank-you page (fired there so the redirect can't drop it).
 */
export function trackRegistration(): void {
  state().cta = true;
  mirror(CTA_KEY, "1");
  sendSession();
  try {
    window.sessionStorage.setItem(LEAD_PENDING_KEY, "1");
  } catch {
    /* storage blocked - Lead simply won't fire */
  }
}

function scrollMilestone(pct: number): number {
  if (pct >= 100) return 100;
  if (pct >= 75) return 75;
  if (pct >= 50) return 50;
  if (pct >= 25) return 25;
  return 0;
}

/**
 * Initialize session tracking: write the row on load, update it on each new
 * scroll milestone, on a heartbeat, and on exit. Returns a cleanup fn.
 */
export function initTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  // Admin/preview exclusion: ?admin=true or ?preview=true permanently flags this
  // browser so the owner's own visits never inflate the analytics.
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true" || params.get("preview") === "true") {
      window.localStorage.setItem(IGNORE_KEY, "true");
    }
  } catch {
    /* localStorage unavailable - nothing to persist */
  }

  initMetaPixel(); // fires fbq PageView when VITE_META_PIXEL_ID is configured

  // Excluded browsers send nothing (no session, scroll, time-on-page or CTA).
  if (analyticsIgnored()) return () => {};

  state(); // establish sessionId + arrival up front
  sendSession(); // initial upsert (creates the row)

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const pct =
      scrollable <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / scrollable) * 100));
    const milestone = scrollMilestone(pct);
    if (milestone > state().maxScroll) {
      state().maxScroll = milestone;
      mirror(MAXSCROLL_KEY, String(milestone));
      sendSession(); // row now reflects the deeper scroll
    }
  };

  const onExit = () => sendSession();
  const onVisibility = () => {
    if (document.visibilityState === "hidden") sendSession();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onExit);

  // Heartbeat: keep time-on-page + max scroll flowing even if exit beacons drop.
  // Only when the tab is visible, to avoid redundant background writes.
  const beat = () => {
    if (document.visibilityState === "visible") sendSession();
  };
  // Early ticks so the row leaves 0s almost immediately (1s, 5s, 15s), then a
  // steady 30s heartbeat (30s, 60s, 90s, ...).
  const timeouts = [1000, 5000, 15000].map((ms) => window.setTimeout(beat, ms));
  const interval = window.setInterval(beat, 30000);

  return () => {
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onExit);
    timeouts.forEach((t) => window.clearTimeout(t));
    window.clearInterval(interval);
  };
}
