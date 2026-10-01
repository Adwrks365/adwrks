/**
 * Phase 5G.5 — repaired in-article CTA visual QA (local dev)
 */
import fs from "fs";
import { mkdirSync } from "fs";
import { spawn } from "child_process";
import {
  auditArticleCtaLinks,
  isBrokenArticleCtaHref,
  isRepairedArticleCtaAnchor,
  repairArticleCtaLinks,
  wrapRepairedArticleCtaBlocks,
} from "../web/src/lib/content/article-ctas.ts";
import {
  stripEmptyElementorSections,
  stripEmptyImageWidgets,
  stripLeadingRedundantElementorSections,
  stripLegacyArticleContactBlocks,
} from "../web/src/lib/content/legacy-blocks.ts";

const OUT = "migration-audit/phase-5g5-qa";
mkdirSync(OUT, { recursive: true });

const posts = JSON.parse(fs.readFileSync("web/src/data/content/posts.json", "utf8"));
const BASE_PROD = "https://adwrks.co.il";
const BASE_LOCAL = process.env.QA_BASE || "http://localhost:3000";

const BUTTON_RE = /<a\s([^>]*class="[^"]*elementor-button[^"]*"[^>]*)>([\s\S]*?)<\/a>/gi;
const NORMAL_LINK_RE = /<a\s([^>]*class="[^"]*elementor-button[^"]*"[^>]*)>([\s\S]*?)<\/a>/gi;

function prepareForRender(raw) {
  let html = raw;
  html = stripLegacyArticleContactBlocks(html);
  html = stripEmptyImageWidgets(html);
  html = stripEmptyElementorSections(html);
  html = stripLeadingRedundantElementorSections(html);
  html = stripEmptyImageWidgets(html);
  html = repairArticleCtaLinks(html);
  html = wrapRepairedArticleCtaBlocks(html);
  return html;
}

function readHref(attrs) {
  return attrs.match(/\shref="([^"]*)"/i)?.[1] ?? "";
}

// Pipeline audit
let totalButtons = 0;
let brokenBefore = 0;
let repaired = 0;
let brokenAfter = 0;
let wrappedBlocks = 0;
let normalLinksBefore = 0;
let normalLinksAfter = 0;

for (const post of posts) {
  const path = decodeURIComponent(new URL(post.link).pathname);
  const stripped = stripLegacyArticleContactBlocks(post.content);
  const before = auditArticleCtaLinks(stripped, post.id, path);

  for (const cta of before.ctas) {
    totalButtons++;
    if (cta.broken) brokenBefore++;
    else normalLinksBefore++;
  }

  const renderedHtml = prepareForRender(post.content);
  wrappedBlocks += (renderedHtml.match(/article-inline-cta-block/g) || []).length;

  let match;
  BUTTON_RE.lastIndex = 0;
  while ((match = BUTTON_RE.exec(renderedHtml)) !== null) {
    const attrs = match[1];
    const href = readHref(attrs);
    if (isRepairedArticleCtaAnchor(attrs)) {
      repaired++;
      continue;
    }
    normalLinksAfter++;
    if (isBrokenArticleCtaHref(href, renderedHtml)) brokenAfter++;
  }
}

const audit = {
  articles: posts.length,
  totalButtonsInBody: totalButtons,
  brokenBefore,
  repaired,
  brokenAfter,
  wrappedBlocks,
  normalLinksBefore,
  normalLinksAfter,
  normalLinksAltered: normalLinksBefore !== normalLinksAfter,
};

fs.writeFileSync(`${OUT}/cta-audit.json`, JSON.stringify(audit, null, 2));

const samples = [
  { id: 21392, label: "B-bold-sentence", anchor: "רוצה לקדם את העסק" },
  { id: 21392, label: "A-paragraph", anchor: "תן למומחים שלנו לקדם אותך בדיגיטל" },
  { id: 21272, label: "C-before-h2", anchor: "רוצה להתייעץ עם מומחה" },
  { id: 21496, label: "D-long-text", anchor: "רוצה לשפר את מהירות" },
];

function pathFor(id) {
  return new URL(posts.find((p) => p.id === id).link).pathname;
}

async function waitForServer(url, ms = 120000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok || res.status === 404) return true;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

async function ensureDevServer() {
  if (process.env.QA_BASE) {
    return waitForServer(`${BASE_LOCAL}/`);
  }

  const child = spawn("npm", ["run", "dev"], {
    cwd: "web",
    shell: true,
    stdio: "ignore",
    detached: true,
  });
  child.unref();
  const ok = await waitForServer(`${BASE_LOCAL}/`);
  if (!ok) throw new Error("dev_server_timeout");
  return child;
}

async function measureCta(page, anchorText) {
  return page.evaluate((text) => {
    const blocks = [...document.querySelectorAll(".article-inline-cta-block")];
    const block =
      blocks.find((b) => b.textContent.includes(text)) ||
      blocks.find((b) => b.querySelector('[data-open-contextual-popup="true"]'));
    if (!block) return null;

    const btn = block.querySelector('[data-open-contextual-popup="true"]');
    const lead = block.querySelector(".elementor-heading-title");
    const btnRect = btn?.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();
    const prose = document.querySelector(".article-body-html");
    const nextHeading = block.parentElement
      ? [...block.parentElement.querySelectorAll(".elementor-widget-heading")].find((h) => {
          const r = h.getBoundingClientRect();
          return r.top > blockRect.bottom - 2 && h.querySelector("h2");
        })
      : null;
    const prevP = block.previousElementSibling?.querySelector("p:last-child") ||
      block.parentElement?.querySelector(".elementor-widget-text-editor p:last-of-type");

    const styles = btn ? getComputedStyle(btn) : null;
    return {
      hasBlock: true,
      hasButton: Boolean(btn),
      buttonHeight: btnRect ? Math.round(btnRect.height) : null,
      buttonWidth: btnRect ? Math.round(btnRect.width) : null,
      fontSize: styles?.fontSize ?? null,
      paddingInline: styles ? `${styles.paddingLeft}/${styles.paddingRight}` : null,
      borderRadius: styles?.borderRadius ?? null,
      blockAlign: getComputedStyle(block).textAlign,
      gapLeadToButton:
        lead && btnRect
          ? Math.round(btnRect.top - lead.getBoundingClientRect().bottom)
          : null,
      gapButtonToNext:
        nextHeading && btnRect
          ? Math.round(nextHeading.getBoundingClientRect().top - btnRect.bottom)
          : null,
      gapParagraphToBlock:
        prevP && blockRect
          ? Math.round(blockRect.top - prevP.getBoundingClientRect().bottom)
          : null,
      isFullWidth: btnRect && prose
        ? Math.round(btnRect.width) >= Math.round(prose.getBoundingClientRect().width * 0.95)
        : null,
    };
  }, anchorText);
}

async function main() {
  await ensureDevServer();
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();

  const spacing = [];
  const viewports = [
    { name: "390", width: 390 },
    { name: "430", width: 430 },
    { name: "768", width: 768 },
    { name: "1440", width: 1440 },
  ];

  for (const sample of samples) {
    const path = pathFor(sample.id);
    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: 1200 } });
      await page.goto(`${BASE_LOCAL}${path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForSelector(".article-inline-cta-block", { timeout: 15000 });

      const loc = page.locator(".article-inline-cta-block").filter({ hasText: sample.anchor }).first();
      if (await loc.count()) {
        await loc.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: `${OUT}/after-${sample.label}-${vp.name}.png`,
          clip: await loc.evaluate((el) => {
            const r = el.getBoundingClientRect();
            const pad = 24;
            return {
              x: Math.max(0, r.x - pad),
              y: Math.max(0, r.y - pad - 40),
              width: Math.min(window.innerWidth, r.width + pad * 2),
              height: Math.min(500, r.height + pad * 2 + 80),
            };
          }),
        });
      }

      const metrics = await measureCta(page, sample.anchor);
      spacing.push({ sample: sample.label, viewport: vp.name, ...metrics });
      await page.close();
    }
  }

  // Production before screenshots (5G.4 state)
  for (const sample of samples.slice(0, 2)) {
    const path = pathFor(sample.id);
    const page = await browser.newPage({ viewport: { width: 390, height: 1200 } });
    await page.goto(`${BASE_PROD}${encodeURI(path).replace(/%25/g, "%")}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    }).catch(() => page.goto(`${BASE_PROD}/${path}`, { waitUntil: "domcontentloaded" }));
    const legacy = page.locator('[data-open-contextual-popup="true"]').filter({ hasText: /ייעוץ|לחץ/ }).first();
    if (await legacy.count()) {
      await legacy.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const box = await legacy.evaluate((el) => {
        const block = el.closest(".elementor-widget-button") || el;
        const r = block.getBoundingClientRect();
        return { x: Math.max(0, r.x - 20), y: Math.max(0, r.y - 60), width: r.width + 40, height: Math.min(420, r.height + 100) };
      });
      await page.screenshot({ path: `${OUT}/before-${sample.label}-390.png`, clip: box });
    }
    await page.close();
  }

  // Popup action
  const popupPage = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await popupPage.goto(`${BASE_LOCAL}${pathFor(21496)}`, { waitUntil: "domcontentloaded" });
  const cta = popupPage.locator('[data-open-contextual-popup="true"]').first();
  await cta.scrollIntoViewIfNeeded();
  await cta.click();
  await popupPage.waitForSelector(".contextual-popup-dialog", { timeout: 8000 });
  const popupPass = (await popupPage.locator(".contextual-popup-dialog").count()) > 0;
  await popupPage.close();
  await browser.close();

  const desktopSpacing = spacing
    .filter((s) => s.viewport === "1440" && s.hasButton)
    .every(
      (s) =>
        s.buttonHeight >= 42 &&
        s.buttonHeight <= 48 &&
        s.blockAlign === "right" &&
        (s.gapLeadToButton === null || (s.gapLeadToButton >= 8 && s.gapLeadToButton <= 16)) &&
        (s.gapButtonToNext === null || s.gapButtonToNext >= 24),
    );

  const mobileSpacing = spacing
    .filter((s) => (s.viewport === "390" || s.viewport === "430") && s.hasButton)
    .every((s) => s.isFullWidth === false && s.buttonHeight <= 48);

  const rtlPass = spacing.filter((s) => s.hasBlock).every((s) => s.blockAlign === "right");

  const report = {
    audit,
    spacing,
    checks: {
      visualNormalization: desktopSpacing && mobileSpacing && rtlPass,
      desktopSpacing,
      mobileSpacing,
      rtlAlignment: rtlPass,
      popupAction: popupPass,
      articleContentUnchanged: !audit.normalLinksAltered && audit.brokenAfter === 0,
    },
  };

  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
