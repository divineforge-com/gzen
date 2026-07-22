import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://gzen.io",
  output: "static",
  build: {
    assets: "_astro",
  },
});
