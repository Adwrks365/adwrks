import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

describe("visibilityProviderMode", () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
  });

  it("defaults to off when unset", async () => {
    delete process.env.SEARCH_VISIBILITY_PROVIDER;
    delete process.env.DATAFORSEO_LOGIN;
    delete process.env.DATAFORSEO_PASSWORD;
    const { visibilityProviderMode } = await import("./provider-mode");
    assert.equal(visibilityProviderMode(), "off");
  });

  it("mock only when explicitly set", async () => {
    process.env.SEARCH_VISIBILITY_PROVIDER = "mock";
    const { visibilityProviderMode } = await import("./provider-mode");
    assert.equal(visibilityProviderMode(), "mock");
  });

  it("live only with credentials", async () => {
    process.env.SEARCH_VISIBILITY_PROVIDER = "live";
    process.env.DATAFORSEO_LOGIN = "user";
    process.env.DATAFORSEO_PASSWORD = "pass";
    const { visibilityProviderMode } = await import("./provider-mode");
    assert.equal(visibilityProviderMode(), "live");
  });

  it("live without credentials stays off (no mock fallback)", async () => {
    process.env.SEARCH_VISIBILITY_PROVIDER = "live";
    delete process.env.DATAFORSEO_LOGIN;
    delete process.env.DATAFORSEO_PASSWORD;
    const { visibilityProviderMode } = await import("./provider-mode");
    assert.equal(visibilityProviderMode(), "off");
  });
});