import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://gzen.io",
  output: "static",
  // Emits /sitemap-index.xml + /sitemap-0.xml at build time (robots.txt points here).
  integrations: [sitemap()],
  build: {
    assets: "_astro",
  },
  server: {
    host: true,
    port: 1318,
    // Allow Cloudflare quick tunnels / remote preview hosts
    allowedHosts: true,
  },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
