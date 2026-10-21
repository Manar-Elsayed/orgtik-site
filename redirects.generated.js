// Written by scripts/prerender-heads.mjs from the Website Manager's redirects. Don't edit by hand.
export default [
 {
  "from": "/imprint",
  "to": "/legal/imprint",
  "code": 301,
  "query": "keep"
 },
 {
  "from": "/platform",
  "to": "/software#plan-builder",
  "code": 301,
  "query": "keep"
 },
 {
  "from": "/platform/*",
  "to": "/software/*",
  "code": 301,
  "query": "keep"
 },
 {
  "from": "/pricing",
  "to": "/software#plan-builder",
  "code": 301,
  "query": "keep"
 },
 {
  "from": "/privacy",
  "to": "/legal/privacy",
  "code": 301,
  "query": "keep"
 },
 {
  "from": "/projects",
  "to": "/work",
  "code": 301,
  "query": "keep"
 },
 {
  "from": "/projects/*",
  "to": "/work/*",
  "code": 301,
  "query": "keep"
 },
 {
  "from": "/sample-campaign",
  "to": "/services",
  "code": 302,
  "query": "keep"
 },
 {
  "from": "/sample-renamed",
  "to": "/services",
  "code": 301,
  "query": "keep"
 },
 {
  "from": "/sample-retired",
  "to": "/services",
  "code": 301,
  "query": "keep"
 },
 {
  "from": "/terms",
  "to": "/legal/terms",
  "code": 301,
  "query": "keep"
 }
];
