import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Dev-only middleware mirroring the production /api functions so `npm run dev`
 * works locally: /api/track-event (analytics rows to the Google Sheet).
 */
function apiDevMiddleware(env: Record<string, string>): Plugin {
  return {
    name: "api-dev-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0];
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const readJson = async (): Promise<any> => {
          let raw = "";
          for await (const chunk of req) raw += chunk;
          return raw ? JSON.parse(raw) : {};
        };

        // ── POST /api/track-event ──────────────────────────────────────────
        if (path === "/api/track-event") {
          if (req.method !== "POST") return send(405, { error: "Method Not Allowed" });
          try {
            const raw = await readJson();
            const device = raw.device === "mobile" ? "mobile" : "desktop";
            const iso = String(raw.timestamp ?? "").slice(0, 40) || new Date().toISOString();
            let timestampIsrael = iso;
            try {
              timestampIsrael = new Intl.DateTimeFormat("en-GB", {
                timeZone: "Asia/Jerusalem",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }).format(new Date(iso));
            } catch {
              /* keep iso */
            }
            const clip = (v: unknown, n = 256) => String(v ?? "").trim().slice(0, n);
            const payload = {
              tag: "Workshop_Analytics",
              sessionId: clip(raw.sessionId, 64),
              timestampIsrael,
              timestamp: iso,
              device,
              seconds: Math.max(0, Math.round(Number(raw.seconds) || 0)),
              maxScroll: clip(raw.maxScroll, 8) || "0%",
              ctaClicked: raw.ctaClicked === true || raw.ctaClicked === "true" || raw.ctaClicked === 1,
              utm_source: clip(raw.utm_source, 128),
              utm_campaign: clip(raw.utm_campaign, 128),
              phone: clip(raw.phone, 64),
              uid: clip(raw.uid, 64),
            };
            if (env.GOOGLE_SHEET_WEBHOOK_URL) {
              try {
                await fetch(env.GOOGLE_SHEET_WEBHOOK_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                  redirect: "follow",
                });
              } catch (e) {
                console.error("[dev track-event] sheet dispatch failed:", e);
              }
            } else {
              console.warn("[dev track-event] GOOGLE_SHEET_WEBHOOK_URL not set - event:", payload);
            }
            res.statusCode = 204;
            res.end();
            return;
          } catch (err) {
            res.statusCode = 204;
            res.end();
            return;
          }
        }

        return next();
      });
    },
  };
}

/**
 * Social crawlers (WhatsApp, Facebook, LinkedIn, X) need absolute URLs for
 * og:image / og:url. index.html uses the __SITE_URL__ token; it is replaced at
 * build time with SITE_URL, else Vercel's production domain, else the
 * deployment URL. With none set (local dev) it falls back to root-relative.
 */
function siteUrlPlugin(env: Record<string, string>): Plugin {
  const host = env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
  const siteUrl = (env.SITE_URL || (host ? `https://${host}` : "")).replace(/\/+$/, "");
  return {
    name: "site-url",
    // "pre" so the token is gone before Vite parses/URI-decodes the HTML.
    transformIndexHtml: {
      order: "pre",
      handler: (html) => html.split("__SITE_URL__").join(siteUrl),
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load all env vars (empty prefix) so the dev middleware can read server-only keys.
  // Only VITE_* vars are ever exposed to client code.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), apiDevMiddleware(env), siteUrlPlugin(env)],
  };
});
