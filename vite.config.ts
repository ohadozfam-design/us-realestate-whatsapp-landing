import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import Stripe from "stripe";
import { buildLineItems } from "./server/lineItems";

/**
 * Dev-only middleware mirroring the production /api functions so `npm run dev`
 * works locally: /api/create-checkout-session (with the seat cap), /api/seats,
 * and /api/waitlist. The secret key is read on the server, never exposed.
 */
function apiDevMiddleware(env: Record<string, string>): Plugin {
  const secretKey = env.STRIPE_SECRET_KEY;
  const MAX_SEATS = Number(env.MAX_SEATS || 25);
  const WORKSHOP_ID = env.WORKSHOP_ID || "Workshop_Oct6";

  async function countPaidSeats(stripe: Stripe): Promise<number> {
    let count = 0;
    const params: Stripe.Checkout.SessionListParams = { limit: 100 };
    for (let page = 0; page < 5; page++) {
      const r = await stripe.checkout.sessions.list(params);
      for (const s of r.data) {
        if (s.payment_status === "paid" && s.metadata?.workshop === WORKSHOP_ID) count++;
      }
      if (!r.has_more || r.data.length === 0) break;
      params.starting_after = r.data[r.data.length - 1].id;
    }
    return count;
  }

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

        // ── GET /api/seats ─────────────────────────────────────────────────
        if (path === "/api/seats") {
          const open = { soldOut: false, remaining: MAX_SEATS, total: MAX_SEATS };
          if (!secretKey) return send(200, open);
          try {
            const paid = await countPaidSeats(new Stripe(secretKey));
            const remaining = Math.max(0, MAX_SEATS - paid);
            return send(200, { soldOut: remaining <= 0, remaining, total: MAX_SEATS });
          } catch {
            return send(200, open);
          }
        }

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

        // ── POST /api/waitlist ─────────────────────────────────────────────
        if (path === "/api/waitlist") {
          if (req.method !== "POST") return send(405, { error: "Method Not Allowed" });
          try {
            const raw = await readJson();
            const name = String(raw.name ?? "").trim();
            const phone = String(raw.phone ?? "").trim();
            const email = String(raw.email ?? "").trim();
            const source = String(raw.source ?? "").trim().slice(0, 64);
            if (name.length < 2 || phone.replace(/\D/g, "").length < 9) {
              return send(400, { error: "נא למלא שם מלא וטלפון תקין." });
            }
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              return send(400, { error: "כתובת האימייל אינה תקינה." });
            }
            const payload = {
              timestamp: new Date().toISOString(),
              name,
              phone,
              email,
              source,
              tag: "Workshop_Waitlist",
            };
            if (env.GOOGLE_SHEET_WEBHOOK_URL) {
              try {
                await fetch(env.GOOGLE_SHEET_WEBHOOK_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
              } catch (e) {
                console.error("[dev waitlist] sheet dispatch failed:", e);
              }
            } else {
              console.warn("[dev waitlist] GOOGLE_SHEET_WEBHOOK_URL not set - lead:", payload);
            }
            return send(200, { ok: true });
          } catch (err) {
            return send(500, { error: err instanceof Error ? err.message : "Waitlist failed" });
          }
        }

        // ── POST /api/create-checkout-session (with seat cap) ──────────────
        if (path === "/api/create-checkout-session") {
          if (req.method !== "POST") return send(405, { error: "Method Not Allowed" });
          if (!secretKey) {
            return send(500, {
              error: "Stripe is not configured (STRIPE_SECRET_KEY missing in .env).",
            });
          }
          try {
            const stripe = new Stripe(secretKey);
            const paid = await countPaidSeats(stripe);
            if (paid >= MAX_SEATS) return send(403, { error: "הוורקשופ בתפוסה מלאה", soldOut: true });

            const { hasOrderBump, name = "", phone = "", email = "" } = await readJson();
            const origin = (req.headers.origin as string) || "http://localhost:5173";
            const lineItems = buildLineItems(Boolean(hasOrderBump));
            const value =
              lineItems.reduce(
                (sum, i) => sum + (i.price_data?.unit_amount ?? 0) * (i.quantity ?? 1),
                0
              ) / 100;
            const session = await stripe.checkout.sessions.create({
              mode: "payment",
              line_items: lineItems,
              ...(email ? { customer_email: String(email).trim() } : {}),
              metadata: {
                name: String(name).trim(),
                phone: String(phone).trim(),
                email: String(email).trim(),
                hasOrderBump: String(Boolean(hasOrderBump)),
                workshop: WORKSHOP_ID,
              },
              success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}&value=${value}&currency=USD`,
              cancel_url: `${origin}/?checkout=cancel`,
            });
            return send(200, { url: session.url });
          } catch (err) {
            return send(500, { error: err instanceof Error ? err.message : "Checkout failed" });
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
  // Load all env vars (empty prefix) so the server can read STRIPE_SECRET_KEY.
  // Only VITE_* vars are ever exposed to client code.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), apiDevMiddleware(env), siteUrlPlugin(env)],
  };
});
