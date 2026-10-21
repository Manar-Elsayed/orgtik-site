// The server redirects: exact codes, wildcards keeping the matched path, and the query setting.
import { test } from "node:test";
import assert from "node:assert/strict";
import middleware, { target } from "../middleware.js";

const go = (path) => middleware(new Request(`https://site.test${path}`));

test("an exact redirect answers with its own code, ignoring a trailing slash", () => {
  const res = go("/pricing/");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://site.test/software#plan-builder");
});

test("a wildcard keeps the matched part of the path and the query string", () => {
  const res = go("/platform/hr?mode=monthly&duration=12");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://site.test/software/hr?mode=monthly&duration=12");
  assert.equal(go("/platform").headers.get("location"), "https://site.test/software#plan-builder", "the exact /platform rule wins over /platform/*");
});

test("query drop, 302 and the wildcard root", () => {
  const rule = { from: "/old/*", to: "/new/*", code: 302, query: "drop" };
  assert.equal(target(rule, "/old"), "/new");
  assert.equal(target(rule, "/old/a/b"), "/new/a/b");
  assert.equal(target(rule, "/older"), null);
  assert.equal(target({ from: "/a", to: "/b", code: 302 }, "/a"), "/b");
});

test("pages that don't redirect and files pass through", () => {
  assert.equal(go("/services"), undefined);
  assert.equal(go("/platform.png"), undefined);
});
