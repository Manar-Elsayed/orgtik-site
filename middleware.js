// Server redirects (Vercel Routing Middleware): the Website Manager's active redirects, written by
// the build to redirects.generated.js (scripts/prerender-heads.mjs). The server answers with the
// exact code each one is set to (301 or 302), keeps the matched part of a wildcard
// (/platform/* → /software/*), and keeps or drops the query string as each redirect says.
import rules from "./redirects.generated.js";

export const config = {
  // Pages only: assets and files never redirect.
  matcher: ["/((?!assets/|_vercel/).*)"],
};

const trim = (path) => (path.length > 1 ? path.replace(/\/+$/, "") : path);
// Exact addresses win over wildcards; a longer wildcard wins over a shorter one.
const ordered = [...rules].sort((a, b) => Number(a.from.endsWith("/*")) - Number(b.from.endsWith("/*")) || b.from.length - a.from.length);

/** Where a path goes under one redirect, or null. */
export function target(rule, path) {
  if (rule.from.endsWith("/*")) {
    const prefix = rule.from.slice(0, -2);
    if (path !== prefix && !path.startsWith(prefix + "/")) return null;
    const rest = path.slice(prefix.length + 1);
    return rule.to.includes("*") ? rule.to.replace("*", rest).replace(/\/(?=#|$)/, (m) => (rest ? m : "")) : rule.to;
  }
  return trim(rule.from) === path ? rule.to : null;
}

export default function middleware(request) {
  const url = new URL(request.url);
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
  const path = trim(url.pathname);
  for (const rule of ordered) {
    const to = target(rule, path);
    if (!to) continue;
    const destination = new URL(to, url.origin);
    if (rule.query !== "drop") for (const [key, value] of url.searchParams) if (!destination.searchParams.has(key)) destination.searchParams.append(key, value);
    return Response.redirect(destination.toString(), rule.code === 302 ? 302 : 301);
  }
}
