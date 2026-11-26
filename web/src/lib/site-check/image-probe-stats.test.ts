import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { imagesTopicLine } from "./image-probe-stats";

describe("imagesTopicLine", () => {
  it("mixed ok, broken, and unverified in Hebrew", () => {
    const line = imagesTopicLine(
      "he",
      {
        imagesProbed: 3,
        pagesWithImages: 2,
        loadedOk: 1,
        broken: 1,
        unverified: 1,
      },
      false,
    );
    assert.match(line.detail, /3 תמונות נבדקו מ־2 עמודים/);
    assert.match(line.detail, /נטענה בהצלחה/);
    assert.match(line.detail, /לא נטענה/);
    assert.match(line.detail, /לא אומתה/);
    assert.equal(line.tone, "warn");
  });

  it("all loaded is ok tone", () => {
    const line = imagesTopicLine(
      "he",
      { imagesProbed: 2, pagesWithImages: 1, loadedOk: 2, broken: 0, unverified: 0 },
      false,
    );
    assert.match(line.detail, /2 נטענו בהצלחה/);
    assert.equal(line.tone, "ok");
  });
});