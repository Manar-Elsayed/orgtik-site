# OrgTik website

The public OrgTik website (React + Vite), managed by the [OrgTik Website Manager](https://github.com/Manar-Elsayed/orgtik-website-manager). This is a standalone copy of `apps/website/landing-directions` from the OrgTik suite monorepo.

## Content

When it loads, the site asks the Website Manager for its published content (`VITE_CMS_API`). It waits up to 1.5 s, then uses the last cached copy or the packaged snapshot (`src/content/snapshot.js`). It works without the Website Manager too, using the snapshot. Edits published in the Website Manager show on the next visit. The Website Manager's Preview tab shows drafts in this site through `?preview=`, and only from `VITE_WM_ORIGIN`.

## Development

```sh
npm install
cp .env.example .env.local   # optional: connect to a local Website Manager on :3007
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

## Deploy to Vercel

Import the repository. `vercel.json` sets the build (`npm run build`), the output (`dist/client`), and the site's redirects and rewrites. Set these environment variables, using your Website Manager's address:

| Variable | Value |
|---|---|
| `VITE_CMS_API` | `https://<website-manager>/api/backend/wm/v2` |
| `VITE_WM_ORIGIN` | `https://<website-manager>` |
| `VITE_SUITE_API` | `https://<website-manager>/api/backend/sos/api` (customer sign-in, sign-up and checkout) |

Redeploy after you change them, because Vite builds them in. `npm run build` also prerenders one HTML file per route, plus `404.html`, `sitemap.xml` and `robots.txt`. `redirects.json` is what `scripts/content-pull.mjs` writes. Copy its changes into `vercel.json`.

Customer sign-in and sign-up work against the Website Manager's demo backend. After signing in, "My account" opens the OrgTik suite's customer dashboard (`VITE_SUITE_URL`), which isn't part of this project.

## Checks

```sh
npm test
npm run build
```

## Editing

The ten page components in `src/reference` contain each page's content, presentation, and interaction state. `site.css` contains global accessibility and typography rules; `states.css` preserves the reference's hover treatments. Navigation lives in `src/reference/navigation.js` and `src/App.jsx`. Assets use root-relative URLs and local fonts, so nested routes do not depend on third-party CDNs.

The import utility converts the supplied export into regular React source. It is a migration tool, not a build step. Do not rerun it over subsequent manual changes without reviewing the diff. The bundled document runtime and editable image-upload widget are not shipped. `image-slot.js` is a display-only image element preserving the reference's image framing and logo mirrors.

## Purchasing and CRM handoff

`/plans` is the Bundles & pricing directory. Each service and software product has one package with identical published features across 1, 3, 6, and 12 months. Department bundles and separate service/software builders feed one editable cart. Hosting is purchased externally at https://orgtik.ch.

`src/reference/purchase-catalog.js` owns sample CHF monthly prices, bundle templates, URL compatibility, migration, and pricing. Each line receives the larger of its duration saving and configured-group item-count saving, without stacking. Prices are rounded once per full-period line and summed. Tax calculation is unconfigured.

Cart v2 preserves legacy selections for review, supports mixed durations and per-item renewal, explicit duplicate resolution, Save/Cancel content edits, and immediate changes with Undo. Only cart configuration persists in localStorage; customer details remain in memory.

Checkout offers guest or demo sign-in, minimal billing details, and a simulated payment with success/decline/cancel outcomes. Successful purchases proceed to a separate CRM handoff, with ready/pending/failed account setup and independent retries. Software activates after payment; service periods await CRM onboarding. A non-sensitive session receipt survives refresh without retaining verified identity.

`src/reference/purchase-adapter.js` defines the mock payment and CRM boundary. No actual charges, account creation, emails, or invoices occur. An unset `VITE_CRM_PORTAL_URL` opens a labeled handoff preview. Production pricing, payment verification, identity, onboarding, invoices, and customer dashboards belong to the backend and separate CRM project.

See [PURCHASING.md](PURCHASING.md) for the contract, storage, legacy-link behavior, integration configuration, and QA scenarios. Older tier and enquiry documents describe previous iterations.


## Browser verification

`tools/verify.cjs`, `tools/interactions.cjs`, and `tools/capture.cjs` use Playwright and connect to a local browser debugging endpoint at port 9222. Set `PLAYWRIGHT_MODULE_PATH` to the available Playwright package when it is provided by the workspace runtime. These are development checks, not production dependencies. See `design-qa.md` for the actual coverage and build status.
