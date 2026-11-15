/**
 * Add Hebrew articles: בניית אתרים ברוסית + קידום אתרים ברוסית
 * Patch missing/short meta on related content.
 * Run: node web/scripts/add-russian-sector-articles.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "..", "src", "data", "content");
const postsPath = path.join(DATA, "posts.json");
const seoPath = path.join(DATA, "seo.json");
const urlsPath = path.join(DATA, "urls.json");

const MARKER = "adwrks-russian-sector-articles-2026-11";

function section(inner, id) {
  return `<div data-elementor-type="wp-post" data-elementor-id="${id}" class="elementor elementor-${id}" data-elementor-post-type="post">
<section class="elementor-section elementor-top-section elementor-element elementor-element-2f35757 elementor-section-boxed elementor-section-height-default elementor-section-height-default wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no" data-id="2f35757" data-element_type="section" data-e-type="section">
<div class="elementor-container elementor-column-gap-default">
<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-934d410" data-id="934d410" data-element_type="column" data-e-type="column">
<div class="elementor-widget-wrap elementor-element-populated">
<!-- ${MARKER} -->
${inner}
</div></div></div></section></div>`;
}

function h2(text) {
  return `<div class="elementor-element elementor-widget elementor-widget-heading" data-element_type="widget" data-widget_type="heading.default"><h2 class="elementor-heading-title elementor-size-default">${text}</h2></div>`;
}

function h3(text) {
  return `<div class="elementor-element elementor-widget elementor-widget-heading" data-element_type="widget" data-widget_type="heading.default"><h3 class="elementor-heading-title elementor-size-default">${text}</h3></div>`;
}

function prose(html) {
  return `<div class="elementor-element elementor-widget elementor-widget-text-editor" data-element_type="widget" data-widget_type="text-editor.default">${html}</div>`;
}

const websiteBody = [
  h2("למה בניית אתרים ברוסית בישראל היא הזדמנות אמיתית לעסק"),
  prose(
    `<p>בישראל חיים מעל מיליון דוברי רוסית — קהל עם כוח קנייה, נאמנות למותגים וציפייה לשירות בשפה המובנת לו. אתר ברוסית (או אתר דו-לשוני עברית־רוסית) מאפשר לעסק להופיע בחיפושים בשתי השפות, לבנות אמון מהר יותר ולהגדיל פניות מאזורים כמו חיפה, קריות, נתניה, ראשון לציון והמרכז.</p>
<p>במאמר מקיף זה נסביר <strong>מה חשוב באתר לקהל דובר רוסית</strong>, איך לשלב UX, תרבות ושיווק דיגיטלי, ואיך להתאים את האתר גם לעידן ה-<strong>SEO, AEO ו-GEO</strong> — כך שתופיעו גם בתשובות AI של גוגל וכלים נוספים.</p>`,
  ),
  h2("מהו אתר \"ברוסית\" — תרגום או התאמה תרבותית?"),
  prose(
    `<p>אתר ברוסית טוב הוא לא רק תרגום מילולי מהעברית. הוא כולל:</p>
<ul>
<li><strong>שפה טבעית</strong> — ניסוחים שמדברים לקהל הרוסי בישראל, לא סלנג מיושן מחו\"ל.</li>
<li><strong>מבנה תוכן ברור</strong> — כותרות, מחירים, אזורי שירות ו-CTA שקופים.</li>
<li><strong>אמון (E-E-A-T)</strong> — פרטי קשר, וותק, ביקורות והמלצות בשפה הרוסית.</li>
<li><strong>ביצועים טכניים</strong> — מהירות, מובייל ונגישות — כמו בכל אתר מקצועי.</li>
</ul>
<p>קראו גם את המדריך שלנו ל<a href="/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99-%d7%91%d7%a9%d7%a4%d7%94-%d7%94%d7%a8%d7%95%d7%a1%d7%99%d7%aa/">פרסום דיגיטלי בשפה הרוסית</a> כדי לחבר בין האתר לערוצי השיווק.</p>`,
  ),
  h2("סוגי אתרים שמתאימים למגזר הרוסי"),
  prose(
    `<ol>
<li><strong>אתר תדמית דו-לשוני</strong> — משרדי עורכי דין, רופאים, קליניקות, שירותי בית.</li>
<li><strong>דף נחיתה לקמפיין</strong> — Google Ads / Meta עם מסר ברוסית וטופס לידים.</li>
<li><strong>חנות אונליין</strong> — קטלוג, תשלום ושירות לקוחות בשתי שפות.</li>
<li><strong>פורטל תוכן</strong> — מדריכים, שאלות נפוצות ומאמרים שמזינים SEO ו-AEO.</li>
</ol>
<p>ב-<a href="/website-building/">שירות בניית אתרים</a> של Adwrks 365 בונים אתרים מותאמים לשיווק — לא רק עיצוב.</p>`,
  ),
  h2("דרישות טכניות ו-SEO לאתר ברוסית"),
  prose(
    `<p>מנועי חיפוש ו-AI קוראים מבנה, לא רק מילים. חובה:</p>
<ul>
<li>תגיות <code>hreflang</code> או מבנה URL עקבי לעברית ורוסית.</li>
<li>כותרת H1 ייחודית בכל שפה, עם ביטויי חיפוש רלוונטיים (למשל <em>בניית אתרים ברוסית</em>).</li>
<li>מטא תיאור של 120–155 תווים בכל גרסה.</li>
<li>סכמת <strong>Organization / LocalBusiness</strong> ונתונים מובנים לשאלות נפוצות.</li>
<li>מהירות טעינה — קישור ל<a href="/%d7%91%d7%93%d7%99%d7%a7%d7%aa-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8/">בדיקת מהירות אתר</a> חינם.</li>
</ul>`,
  ),
  h2("AEO ו-GEO: להופיע בתשובות AI"),
  prose(
    `<p><strong>AEO (Answer Engine Optimization)</strong> דורש תשובות קצרות וברורות לשאלות נפוצות — בתוך המאמר ובעמודי האתר. <strong>GEO (Generative Engine Optimization)</strong> מדגיש סמכות, עדכון שוטף וציטוט מקורות.</p>
<p>על האתר הברוסי כדאי לכלול: בלוק שאלות ותשובות, טבלאות השוואה, מחירון שקוף וקישורים פנימיים למאמרים מקצועיים — בדיוק כמו במאמר זה.</p>`,
  ),
  h2("תהליך עבודה מומלץ עם סוכנות"),
  prose(
    `<ol>
<li>אפיון קהל — איזור גיאוגרפי, גיל, שירותים ומתחרים בשפה הרוסית.</li>
<li>מפת מילות מפתח בעברית וברוסית.</li>
<li>עיצוב ותוכן — כולל עריכה לשונית ברוסית.</li>
<li>הקמה, אנליטיקס, המרות וחיבור לקמפיינים.</li>
<li>ליווי <a href="/seo/">קידום אורגני</a> ותוכן מתמשך.</li>
</ol>
<p>Adwrks 365 מלווה עסקים בעברית, רוסית ואנגלית מאז 2018 — <a href="/contact-us/">צור קשר</a> לייעוץ.</p>`,
  ),
  h2("שאלות נפוצות — בניית אתרים ברוסית"),
  h3("האם חייבים אתר נפרד ברוסית?"),
  prose(
    `<p>לא תמיד. אתר דו-לשוני אחד עם נתיבים ברורים (למשל <code>/ru/</code>) לרוב מספיק ל-SEO ולניהול תוכן. אתר נפרד מתאים כשהמותג או קהל היעד שונים משמעותית.</p>`,
  ),
  h3("כמה עולה בניית אתר ברוסית?"),
  prose(
    `<p>המחיר תלוי בהיקף, בשפות, בקטלוג ובאינטגרציות. ראו <a href="/%d7%9e%d7%97%d7%99%d7%a8%d7%95%d7%9f-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/">מחירון שיווק דיגיטלי</a> או בקשו הצעה מותאמת.</p>`,
  ),
  h3("מי כותב את התוכן ברוסית?"),
  prose(
    `<p>תוכן שיווקי צריך עורך דובר רוסית — לא תרגום אוטומטי. כך נשמרים טון, אמון והמרות, וגם AI מזהה תוכן איכותי.</p>`,
  ),
].join("\n");

const seoBody = [
  h2("קידום אתרים ברוסית: המדריך המלא לעסקים בישראל"),
  prose(
    `<p><strong>קידום אתרים ברוסית</strong> מאפשר להופיע בגוגל כשלקוחות מחפשים בעברית <em>וגם</em> בביטויים ברוסית — בשירותי בית, רפואה, ייעוץ, נדל\"ן, יופי ועוד. מדובר בנישה עם תחרות נמוכה יחסית בחלק מהתחומים, ולכן הזדמנות לצמיחה אורגנית מהירה יותר.</p>
<p>במדריך זה נפרט אסטרטגיית SEO מלאה, התאמה ל<strong>סקירות AI (GEO/AEO)</strong>, וקישור ל<a href="/%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%9e%d7%a7%d7%a6%d7%95%d7%99%d7%99-%d7%9c%d7%a7%d7%94%d7%9c-%d7%93%d7%95%d7%91%d7%a8-%d7%a8%d7%95%d7%a1%d7%99%d7%aa/">שיווק לקהל דובר רוסית</a> ול<a href="/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99-%d7%91%d7%a9%d7%a4%d7%94-%d7%94%d7%a8%d7%95%d7%a1%d7%99%d7%aa/">פרסום דיגיטלי ברוסית</a>.</p>`,
  ),
  h2("מחקר מילות מפתח ברוסית ובעברית"),
  prose(
    `<p>התחילו מרשימת שאלות שהלקוחות באמת שואלים — בשתי השפות. כלים כמו Google Search Console, תכנון מילות מפתח וניתוח מתחרים מראים אילו ביטויים מייצרים חשיפה.</p>
<ul>
<li>שילוב <strong>עברית + רוסית</strong> באותו אתר דו-לשוני.</li>
<li>דפי שירות ייעודיים לערים (חיפה, קריות, ת\"א) — בשני המידות.</li>
<li>ביטויים ארוכים (long-tail) בשפה הרוסית — לעתים קל יותר לדירוג.</li>
</ul>`,
  ),
  h2("אופטימיזציה על הדף (On-Page)"),
  prose(
    `<p>לכל דף ברוסית:</p>
<ul>
<li>כותרת H1 עם מילת המפתח המרכזית.</li>
<li>מטא title ו-description ייחודיים — 120–155 תווים.</li>
<li>מבנה H2/H3 עם תשובות ישירות לשאלות (מצוין ל-AEO).</li>
<li>קישורים פנימיים למאמרים מקושרים (למשל מדריך בניית אתרים ברוסית באותו אתר).</li>
<li>תמונות עם alt תיאורי ברוסית.</li>
</ul>`,
  ),
  h2("תוכן, סמכות (E-E-A-T) ו-GEO"),
  prose(
    `<p>גוגל ומודלי AI מעדיפים מקורות עם ניסיון מוכח. פרסמו מדריכים, מחירונים שקופים, מקרי בוחן ועדכונים. המאמר <a href="/seo-2026-ai-answers/">SEO 2026 ו-AI Overviews</a> מסביר איך להיכנס לסקירות AI — העקרונות זהים גם לקידום ברוסית.</p>
<p>הוסיפו נתונים מקומיים (אזורי שירות), ביקורות אמיתיות ומדיניות פרטיות ברורה — אותות אמון לבוטים ולגולשים.</p>`,
  ),
  h2("SEO טכני ומקומי"),
  prose(
    `<ul>
<li>אינדוקס נכון: sitemap, robots, canonical.</li>
<li>Core Web Vitals — במיוחד במובייל.</li>
<li><strong>Google Business Profile</strong> בעברית; תיאור שמזכיר שירות ברוסית כשזה רלוונטי.</li>
<li>ביקורות לקוחות — כולל רוסית כשאפשר.</li>
</ul>
<p>שירותי <a href="/seo/">קידום אורגני</a> שלנו כוללים מעקב, דוחות ושיפור מתמשך.</p>`,
  ),
  h2("שילוב PPC ו-SEO לקהל רוסי"),
  prose(
    `<p>בשלב הראשון קמפיינים ב-<a href="/google-ads/">Google Ads</a> מביאים תנועה מיידית; SEO בונה נכס לטווח ארוך. חשוב שדפי הנחיתה והאתר יתאימו לשפה של המודעה — אחרת אחוז ההמרה נפגע.</p>`,
  ),
  h2("מדידה והצלחה"),
  prose(
    `<p>הגדירו KPI: דירוגים לביטויים ברוסית, תנועה אורגנית, לידים, שיחות. בדקו ב-Search Console את השאילתות בשני השפות והפרידו בין ערוצים ב-GA4.</p>`,
  ),
  h2("שאלות נפוצות — קידום אתרים ברוסית"),
  h3("כמה זמן לוקח לראות תוצאות SEO ברוסית?"),
  prose(
    `<p>בדרך כלל סימנים ראשונים בחודשיים–שלושה; תחרות ותוכן משפיעים. נישות מקומיות עם מעט מתחרים יכולות להתקדם מהר יותר.</p>`,
  ),
  h3("האם קידום ברוסית פוגע בדירוג בעברית?"),
  prose(
    `<p>לא, כשהמבנה דו-לשוני נכון (hreflang, תוכן ייחודי בכל שפה). להפך — מרחיבים חשיפה לקהלים שונים.</p>`,
  ),
  h3("מה ההבדל בין SEO ל-AEO לקהל רוסי?"),
  prose(
    `<p>SEO ממקד דירוג בגוגל; AEO ממקד תשובות קצרות ומובנות; GEO ממקד הופעה בסקירות AI. שלושתם דורשים תוכן איכותי בשפה הנכונה — רוסית מקצועית, לא תרגום גרוע.</p>`,
  ),
].join("\n");

const ARTICLES = [
  {
    id: 22840,
    slug: "%d7%91%d7%a0%d7%99%d7%99%d7%aa-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa",
    path: "/%d7%91%d7%a0%d7%99%d7%99%d7%aa-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa/",
    title: "בניית אתרים ברוסית בישראל | מדריך מקיף 2026",
    excerpt:
      "<p>מדריך מלא לבניית אתרים ברוסית לעסקים בישראל: דו-לשוניות, UX, SEO, AEO ו-GEO, וטיפים להמרת קהל דובר רוסית.</p>",
    categories: [226, 1],
    tags: [253, 410],
    featuredMedia: 20668,
    metaTitle: "בניית אתרים ברוסית בישראל | מדריך מקיף 2026 ⋆ Adwrks 365",
    metaDescription:
      "מדריך לבניית אתרים ברוסית בישראל: אתר דו-לשוני, SEO, AEO ו-GEO, UX לקהל דובר רוסית וטיפים מעשיים מ-Adwrks 365 לעסקים שרוצים פניות.",
    content: section(websiteBody, 22840),
  },
  {
    id: 22841,
    slug: "%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa",
    path: "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa/",
    title: "קידום אתרים ברוסית | SEO, AEO ו-GEO לקהל דובר רוסית",
    excerpt:
      "<p>איך לקדם אתר ברוסית בגוגל ובסקירות AI: מילות מפתח, תוכן, SEO טכני, מקומי ושילוב עם פרסום ממומן — מדריך מקצועי לעסקים בישראל.</p>",
    categories: [412, 1],
    tags: [253, 410, 378],
    featuredMedia: 20668,
    metaTitle: "קידום אתרים ברוסית | SEO, AEO ו-GEO ⋆ Adwrks 365",
    metaDescription:
      "קידום אתרים ברוסית בישראל: מחקר מילות מפתח, אופטימיזציה על הדף, SEO טכני, E-E-A-T ו-GEO לסקירות AI. מדריך מעשי מסוכנות Adwrks 365.",
    content: section(seoBody, 22841),
  },
];

const META_PATCHES = [
  {
    match: (url) => url.includes("%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%a8%d7%95%d7%a1%d7%99%d7%aa") && url.includes("/tag/"),
    metaDescription:
      "מאמרים על פרסום ברוסית בישראל: שיווק דיגיטלי לקהל דובר רוסית, קמפיינים, אתרים דו-לשוניים וקידום. תוכן מקצועי מ-Adwrks 365.",
    ogDescription:
      "מאמרים על פרסום ברוסית בישראל: שיווק דיגיטלי לקהל דובר רוסית, קמפיינים, אתרים דו-לשוניים וקידום. תוכן מקצועי מ-Adwrks 365.",
  },
  {
    match: (url) => url.includes("%d7%9b%d7%9a-%d7%91%d7%95%d7%97%d7%a8%d7%99%d7%9d-%d7%97%d7%91%d7%a8%d7%94-%d7%9c%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99"),
    metaDescription:
      "איך לבחור חברה לשיווק דיגיטלי שמביאה תוצאות: שקיפות, מדידה, התאמה לעסק וניסיון מוכח. קריטריונים מעשיים לפני חתימה — מ-Adwrks 365.",
    ogDescription:
      "איך לבחור חברה לשיווק דיגיטלי שמביאה תוצאות: שקיפות, מדידה, התאמה לעסק וניסיון מוכח. קריטריונים מעשיים לפני חתימה — מ-Adwrks 365.",
  },
  {
    match: (url) => url.includes("%d7%9b%d7%95%d7%97%d7%9d-%d7%a9%d7%9c-%d7%91%d7%99%d7%a7%d7%95%d7%a8%d7%95%d7%aa"),
    metaDescription:
      "למה ביקורות והמלצות משפיעות על המרות ו-SEO: איך לאסוף, להציג ולנהל מוניטין דיגיטלי באתר ובגוגל — מדריך קצר מ-Adwrks 365.",
    ogDescription:
      "למה ביקורות והמלצות משפיעות על המרות ו-SEO: איך לאסוף, להציג ולנהל מוניטין דיגיטלי באתר ובגוגל — מדריך קצר מ-Adwrks 365.",
  },
];

const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
const seo = JSON.parse(fs.readFileSync(seoPath, "utf8"));
const urls = JSON.parse(fs.readFileSync(urlsPath, "utf8"));

const report = { added: [], skipped: [], metaPatched: [] };

for (const article of ARTICLES) {
  if (posts.some((p) => p.id === article.id || p.content.includes(MARKER) && p.title === article.title)) {
    report.skipped.push(article.id);
    continue;
  }

  const link = `https://adwrks.co.il${article.path}`;
  const date = "2026-11-15T09:00:00";
  posts.unshift({
    id: article.id,
    slug: article.slug,
    link,
    title: article.title,
    content: article.content,
    excerpt: article.excerpt,
    date,
    modified: date,
    featuredMedia: article.featuredMedia,
    categories: article.categories,
    tags: article.tags,
  });

  const seoRecord = {
    url: link,
    title: article.metaTitle,
    metaDescription: article.metaDescription,
    robots: "follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
    canonical: link,
    ogTitle: article.metaTitle,
    ogDescription: article.metaDescription,
    ogImage: "https://adwrks.co.il/wp-content/uploads/digital-marketing-agency.webp",
    jsonLd: [],
  };
  seo.push(seoRecord);

  if (!urls.sitemapUrls.includes(link)) {
    urls.sitemapUrls.push(link);
  }

  report.added.push(article.path);
}

for (const patch of META_PATCHES) {
  for (const rec of seo) {
    if (!patch.match(rec.url)) continue;
    if (!rec.metaDescription?.trim()) {
      rec.metaDescription = patch.metaDescription;
      rec.ogDescription = patch.ogDescription;
      report.metaPatched.push(rec.url);
    }
  }
}

fs.writeFileSync(postsPath, JSON.stringify(posts));
fs.writeFileSync(seoPath, JSON.stringify(seo));
fs.writeFileSync(urlsPath, JSON.stringify(urls));

console.log(JSON.stringify(report, null, 2));