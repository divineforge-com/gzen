import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://gzen.io",
  output: "static",
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
