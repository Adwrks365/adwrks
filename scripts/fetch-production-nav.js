#!/usr/bin/env node
fetch("https://adwrks.co.il/")
  .then((r) => r.text())
  .then((html) => {
    const navMatch = html.match(/<nav[^>]*menu[^>]*>([\s\S]*?)<\/nav>/i);
    const section = navMatch ? navMatch[1] : html;
    const links = [...section.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
    for (const [, href, label] of links) {
      const text = label.replace(/<[^>]+>/g, "").trim();
      if (text.length > 0 && text.length < 40) {
        console.log(JSON.stringify({ label: text, href }));
      }
    }
  });
