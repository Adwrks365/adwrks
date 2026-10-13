import fs from "node:fs";
import path from "node:path";

const bodyHe = fs.readFileSync(
  path.join("web/src/data/content/patches/post-22727-body.html"),
  "utf8",
);

function patchPosts(file, locale) {
  const posts = JSON.parse(fs.readFileSync(file, "utf8"));
  const post = posts.find((p) => p.id === 22727);
  if (!post) throw new Error(`post 22727 missing in ${file}`);

  if (locale === "he") {
    post.content = bodyHe.trim();
    post.modified = "2026-10-13T12:00:00";
  } else {
    post.content = bodyHe
      .replace(/href="\/([^"]+)"/g, (_, p) => {
        if (p.startsWith("en/")) return `href="/${p}"`;
        if (p === "check-fit/") return 'href="/en/check-fit/"';
        if (p === "contact-us/") return 'href="/en/contact-us/"';
        if (p === "google-ads/") return 'href="/en/google-ads/"';
        if (p === "מחירון-שיווק-דיגיטלי/") return 'href="/en/digital-marketing-pricing/"';
        if (p === "שיווק-דיגיטלי-לעסקים/") return 'href="/en/digital-marketing-for-business/"';
        if (p === "אסטרטגיות-שיווק-דיגיטלי-2025/")
          return 'href="/en/digital-marketing-strategies-2025/"';
        if (p === "כך-בוחרים-חברה-לשיווק-דיגיטלי/")
          return 'href="/en/choosing-digital-marketing-agency/"';
        if (p === "כמה-עולה-פרסום-בגוגל/") return 'href="/en/google-ads-cost/"';
        if (p === "קידום-ממומן-מול-קידום-אורגני/") return 'href="/en/paid-vs-organic-seo/"';
        if (p === "פרסום-בגוגל-אדס-10-שלבים-פשוטים/")
          return 'href="/en/google-ads-10-steps/"';
        if (p === "פרסום-ממומן-בפייסבוק/") return 'href="/en/facebook-ads-guide/"';
        if (p === "שיווק-בפייסבוק-ואינסטגרם/") return 'href="/en/facebook-instagram-marketing/"';
        if (p === "פרסום-בגוגל-7-אסטרטגיות/") return 'href="/en/google-ads-7-strategies/"';
        if (p === "רימרקטינג-מה-זה-ואיך-ולמה/") return 'href="/en/remarketing-guide/"';
        if (p === "") return 'href="/en/"';
        return `href="/en/${p}"`;
      })
      .trim();
    post.modified = "2026-10-13T12:00:00";
  }

  fs.writeFileSync(file, JSON.stringify(posts));
  console.log("patched", file);
}

patchPosts("web/src/data/content/posts.json", "he");
patchPosts("web/src/data/content-en/posts.json", "en");
console.log("post 22727 body applied");
