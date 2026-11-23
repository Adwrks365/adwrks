import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildLeadAttribution } from "./contact-form-attribution";
import { buildLeadEmail } from "./lead-email-template";
import { VISIBILITY_DEMO_MARKER_HE } from "@/lib/search-visibility/visibility-demo-marker";

describe("buildLeadEmail visibility demo", () => {
  it("marks demo visibility in subject, text, and html", () => {
    const { subject, text, html } = buildLeadEmail({
      formId: "site-check",
      formLabel: "בדיקת אתר",
      name: "Test",
      phone: "0500000000",
      message: `דוח סריקה\n${VISIBILITY_DEMO_MARKER_HE}`,
      attribution: buildLeadAttribution({
        pageTitle: "בדיקת אתר",
        pagePath: "/בדיקת-אתר/",
        pageUrl: "https://adwrks.co.il/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%90%D7%AA%D7%A8/",
      }),
      submittedAt: new Date("2026-11-23T12:00:00Z"),
    });

    assert.match(subject, /נראות: דוגמה/);
    assert.match(text, /נתוני דוגמה בלבד/);
    assert.match(html, /נתוני דוגמה בלבד/);
  });
});