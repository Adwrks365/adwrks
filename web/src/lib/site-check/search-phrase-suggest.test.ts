import assert from "node:assert/strict";
import test from "node:test";
import type { AnalyzablePage } from "./findings";
import { suggestSearchPhrases } from "./search-phrase-suggest";
import type { ParsedPage } from "./types";

function page(overrides: Partial<AnalyzablePage> & Pick<AnalyzablePage, "url" | "label">): AnalyzablePage {
  const parsed: ParsedPage = {
    title: overrides.label,
    metaDescription: "",
    robots: "",
    h1: [overrides.label],
    navLinks: [],
    links: [],
    hasForm: false,
    hasPurchaseCta: false,
    telHrefs: [],
    hasWhatsapp: false,
    contactPhones: [],
    heroImages: [],
    visibleTextLength: 400,
  };
  return {
    ...overrides,
    role: overrides.role ?? "inner",
    parsed: overrides.parsed ?? parsed,
    headerRobots: "",
    truncated: false,
    readable: true,
  };
}

test("suggestSearchPhrases prefers product and category for stores", () => {
  const home = page({ url: "https://shop.test/", label: "בית", role: "home" });
  home.parsed.h1 = [];
  const cat = page({
    url: "https://shop.test/343-garden/",
    label: "ריהוט גן",
    commerceKind: "category",
  });
  const product = page({
    url: "https://shop.test/items/1-chair",
    label: "כיסא גן",
    commerceKind: "product",
  });
  const phrases = suggestSearchPhrases([home, cat, product], "store", "he");
  assert.ok(phrases.length >= 2);
  assert.ok(phrases.some((p) => p.text.includes("גן") || p.text.includes("כיסא")));
});