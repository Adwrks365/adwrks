import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../../migration-audit/phase-5i4d-qa");
const BASE = process.env.QA_BASE || "http://localhost:4323";

const shots = [
  ["about-cap-1440.png", `${BASE}/about-us/`, 1440, ".ab-capabilities-grid"],
  ["about-cap-390.png", `${BASE}/about-us/`, 390, ".ab-capabilities-grid"],
  ["about-eco-390.png", `${BASE}/about-us/`, 390, ".ab-ecosystem"],
  ["about-trust-390.png", `${BASE}/about-us/`, 390, ".ab-trust-strip"],
  ["pricing-1440.png", `${BASE}/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/`, 1440, ".pp-cards-grid"],
  ["pricing-390.png", `${BASE}/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/`, 390, ".pp-card"],
  ["contact-390.png", `${BASE}/contact-us/`, 390, ".cp-trust-strip"],
  ["hub-1440.png", `${BASE}/%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/`, 1440, ".sp-hub-grid"],
  ["seo-390.png", `${BASE}/seo/`, 390, ".sp-campaign-grid--enriched"],
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const [file, url, width, selector] of shots) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    const el = await page.locator(selector).first();
    if (await el.count()) {
      await el.screenshot({ path: path.join(OUT, file) });
    } else {
      await page.screenshot({ path: path.join(OUT, file) });
    }
    console.log("saved", file);
  } catch (error) {
    console.error("fail", file, error.message);
  }
  await page.close();
}

await browser.close();
