import { generateEnSitemap } from "@/app/sitemap";

export async function GET() {
  const entries = generateEnSitemap();
  const body = entries
    .map((entry) => {
      const altLinks = entry.alternates?.languages
        ? Object.entries(entry.alternates.languages)
            .map(
              ([lang, href]) =>
                `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`,
            )
            .join("\n")
        : "";
      return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified}</lastmod>
${altLinks}
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
