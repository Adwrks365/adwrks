import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatPageTypeSummary } from "./page-type-summary";

describe("formatPageTypeSummary he", () => {
  it("uses singular contact page copy", () => {
    const text = formatPageTypeSummary("he", "service", {
      home: 1,
      product: 0,
      category: 0,
      contact: 1,
      service: 9,
      other: 0,
    });
    assert.match(text, /עמוד יצירת קשר אחד/);
    assert.doesNotMatch(text, /1 עמודי יצירת קשר/);
  });
});