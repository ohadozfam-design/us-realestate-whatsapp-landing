import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";

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
  // Load all env vars (empty prefix) so SITE_URL / VERCEL_* are readable here.
  // Only VITE_* vars are ever exposed to client code.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), siteUrlPlugin(env)],
  };
});
