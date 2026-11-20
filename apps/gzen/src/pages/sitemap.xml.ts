import type { APIRoute } from "astro";

// Every top-level page in src/pages is listed automatically, so new pages
// appear in /sitemap.xml without editing this file. Endpoint files (this one)
// are not .astro files, so they are never included.
const pages = import.meta.glob("./*.astro");

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://gzen.io");
  const paths = Object.keys(pages)
    .map((file) => file.replace("./", "").replace(".astro", ""))
    .map((name) => (name === "index" ? "/" : `/${name}/`))
    .sort();

  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, origin).href}</loc></url>`)
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
