const NAV = `
<header><nav>
<a href="/site-check-sample/">בית</a>
<a href="/site-check-sample/services">שירות</a>
<a href="/site-check-sample/contact">יצירת קשר</a>
</nav></header>`;

export function siteCheckFixtureHtml(slug: "index" | "services" | "contact"): string {
  const title = "שירותי דמו לבדיקת אתר";
  const filler = "<p>תוכן דמו ארוך לבדיקה אוטומטית. ".repeat(35);
  const main =
    slug === "index"
      ? `<h1>דמו לבדיקת אתר</h1><p>דף זה מיועד לבדיקות פנימיות של כלי הסריקה בלבד.</p>${filler}`
      : slug === "services"
        ? `<h1>שירות לדוגמה</h1><p>תוכן דמו לבדיקת כותרות כפולות בין עמודים.</p>${filler}`
        : `<h1>יצירת קשר</h1><p>טלפון להתקשרות: 079-5599449</p>
<form><label>שם <input type="text" name="name" /></label><button type="submit">שלח</button></form>${filler}`;
  return `<!DOCTYPE html><html lang="he" dir="rtl"><head>
<meta charset="utf-8" />
<title>${title}</title>
<meta name="description" content="דף בדיקה פנימי" />
<meta name="robots" content="index, follow" />
</head><body>${NAV}<main>${main}</main></body></html>`;
}