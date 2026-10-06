// Ad tags: Meta Pixel + Google Tag, both loaded client-side from build-time env
// vars. Each is a silent no-op when its id is unset, so local dev and preview
// builds never load third-party scripts or throw console errors.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/* ── Meta Pixel ─────────────────────────────────────────────────────────── */

/** Bootstrap the Meta Pixel from VITE_META_PIXEL_ID and fire PageView. */
function initMetaPixel(): void {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  if (!pixelId || typeof pixelId !== "string") return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (w.fbq) return;

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

/* ── Google Tag: gtag.js for G-/AW- ids, the GTM container for GTM- ids ──── */

function googleTagId(): string {
  const id = import.meta.env.VITE_GOOGLE_TAG_ID;
  return typeof id === "string" ? id.trim() : "";
}

let googleTagLoaded = false;

/** Load Google Tag once when VITE_GOOGLE_TAG_ID is set; `config` sends page_view. */
function initGoogleTag(): void {
  const id = googleTagId();
  if (!id || googleTagLoaded) return;
  googleTagLoaded = true;

  const dataLayer = (window.dataLayer = window.dataLayer || []);
  const script = document.createElement("script");
  script.async = true;

  if (id.startsWith("GTM-")) {
    dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  } else {
    // gtag.js expects the raw `arguments` object in the dataLayer, not an array.
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id);
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  }
  document.head.appendChild(script);
}

/* ── public API ─────────────────────────────────────────────────────────── */

/** Load both tags (each fires its own page view). Call once on app mount. */
export function initTracking(): void {
  if (typeof window === "undefined") return;
  initMetaPixel();
  initGoogleTag();
}

let joinTracked = false;

/**
 * A WhatsApp join button was clicked. Fires Meta `Lead` + custom `JoinWhatsApp`
 * and Google `generate_lead` (+ an Ads conversion when a label is set). Lead
 * conversions fire once per page load so repeat clicks don't inflate them.
 * Called synchronously from the link's click handler; the link itself opens in
 * a new tab/the WhatsApp app, so this page stays alive to flush the beacons.
 */
export function trackJoinWhatsApp(location: string): void {
  if (typeof window === "undefined" || joinTracked) return;
  joinTracked = true;

  try {
    window.fbq?.("track", "Lead");
    window.fbq?.("trackCustom", "JoinWhatsApp", { location });
  } catch {
    /* pixel not present */
  }

  const id = googleTagId();
  if (!id) return;
  try {
    if (id.startsWith("GTM-")) {
      window.dataLayer?.push({ event: "generate_lead", cta_location: location });
      return;
    }
    window.gtag?.("event", "generate_lead", { cta_location: location });
    const label = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL;
    if (id.startsWith("AW-") && label) {
      window.gtag?.("event", "conversion", { send_to: `${id}/${label}` });
    }
  } catch {
    /* tag not present */
  }
}
