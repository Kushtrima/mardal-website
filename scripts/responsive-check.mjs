/**
 * **The responsive check** — every page at the widths people use, in a real
 * browser, for the faults a phone shows first.
 *
 * Owner, 2026-10-06: "now we need to start working on responsivenes and
 * mobile device". The render tests read the HTML, which cannot see a layout,
 * so this drives Chrome over the running site (`npm run dev`, or anything
 * else at --url) and reports, page by page and width by width:
 *
 *   - sideways scroll: the page wider than the screen               (fails)
 *   - spill: an element past the screen's edge with nothing clipping
 *     it — the cause of sideways scroll, or text cut at the edge    (fails)
 *   - small targets on a touch screen: anything pressable under
 *     24px either way fails (WCAG 2.2 AA); under 44px warns
 *     (Apple's and Google's guidance)                         (fails/warns)
 *   - small text: under 12px                                         (warns)
 *   - form fields under 16px on a touch screen: Safari zooms the page
 *     in on them when they are tapped                                (warns)
 *   - heavy images: drawn at under a third of the pixels they carry  (warns)
 *
 * Phones and tablets are emulated as touch screens, so the page runs the way
 * it does on one — no ScrollSmoother, the mobile menu, `hover: none`.
 *
 *   node scripts/responsive-check.mjs                  every page, every width
 *   node scripts/responsive-check.mjs --phones         360, 390 and 430 only
 *   node scripts/responsive-check.mjs /services /      just these pages
 *   node scripts/responsive-check.mjs --url http://localhost:3001
 *
 * Exits 1 if anything fails, so it can gate a change.
 */

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : fallback;
};

const BASE = option("--url", "http://localhost:3001");
const CHROME = option(
  "--chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
);
const PORT = Number(option("--port", "9460"));

/** Every route with a page of its own. */
const ALL_ROUTES = [
  "/",
  "/services",
  "/products",
  "/case-studies",
  "/about",
  "/contact",
  "/blog",
  "/privacy",
];

/** The widths that matter: three phones, two tablets, two desktops. */
const SIZES = [
  { width: 360, height: 780, touch: true },
  { width: 390, height: 844, touch: true },
  { width: 430, height: 932, touch: true },
  { width: 768, height: 1024, touch: true },
  { width: 1024, height: 1366, touch: true },
  { width: 1280, height: 800, touch: false },
  { width: 1440, height: 900, touch: false },
];

const routes = args.filter((arg) => arg.startsWith("/"));
const ROUTES = routes.length ? routes : ALL_ROUTES;
const WIDTHS = flag("--phones") ? SIZES.filter((size) => size.width < 500) : SIZES;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* The page's own measurements: run inside it, so it reads what is drawn.
   `touch` is the emulated device's, not the page's own reading: headless
   Chrome has no mouse, so it reports `hover: none` on a desktop too. */
const measure = (touch) => `(() => {
  const W = innerWidth;
  const touch = ${touch};
  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) return false;
    /* .visually-hidden: there for a screen reader, not for a finger. */
    if (s.clipPath === "inset(50%)") return false;
    const b = el.getBoundingClientRect();
    return b.width > 1 && b.height > 1;
  };
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(hidden|clip)/.test(s.overflowX + s.overflow)) return true;
    }
    return false;
  };
  const name = (el) => {
    const c = typeof el.className === "string" ? el.className.trim().split(/\\s+/)[0] : "";
    return el.tagName.toLowerCase() + (c ? "." + c : "");
  };
  const spill = [];
  for (const el of document.querySelectorAll("body *")) {
    if (getComputedStyle(el).position === "fixed" || !visible(el)) continue;
    const b = el.getBoundingClientRect();
    if ((b.right > W + 1 || b.left < -1) && !clipped(el)) spill.push(name(el));
  }
  const fail = [], warn = [];
  if (touch) {
    const pressable = 'a[href], button, [role="button"], input, select, textarea, summary, label[for]';
    for (const el of document.querySelectorAll(pressable)) {
      if (!visible(el) || el.closest("[aria-hidden='true'], [inert]")) continue;
      const b = el.getBoundingClientRect();
      const size = Math.round(b.width) + "x" + Math.round(b.height);
      /* A link inside running text is sized by its line, and WCAG excepts it. */
      const inline = getComputedStyle(el).display === "inline" && el.closest("p, li") && el.closest("p, li").textContent.trim().length > el.textContent.trim().length + 20;
      if (inline) continue;
      if (b.width < 24 || b.height < 24) fail.push(name(el) + " " + size);
      else if (b.width < 44 || b.height < 44) warn.push(name(el) + " " + size);
    }
  }
  const zoom = [];
  if (touch) {
    for (const el of document.querySelectorAll("input, select, textarea")) {
      if (visible(el) && parseFloat(getComputedStyle(el).fontSize) < 16) zoom.push(name(el) + " " + getComputedStyle(el).fontSize);
    }
  }
  const small = new Set();
  for (const el of document.querySelectorAll("body *")) {
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    if (!visible(el) || el.closest("[aria-hidden='true']")) continue;
    if (parseFloat(getComputedStyle(el).fontSize) < 12) small.add(name(el));
  }
  const heavy = [];
  for (const img of document.querySelectorAll("img")) {
    if (!visible(img) || !img.naturalWidth) continue;
    const drawn = img.getBoundingClientRect().width * devicePixelRatio;
    if (img.naturalWidth > drawn * 3 && img.naturalWidth > 800) heavy.push(name(img) + " " + img.naturalWidth + "px for " + Math.round(drawn));
  }
  return {
    sideways: document.documentElement.scrollWidth > W,
    docWidth: document.documentElement.scrollWidth,
    spill: [...new Set(spill)].slice(0, 8),
    targetsFail: [...new Set(fail)].slice(0, 8),
    targetsWarn: [...new Set(warn)].slice(0, 8),
    targetsWarnCount: warn.length,
    smallText: [...small].slice(0, 6),
    zoom: [...new Set(zoom)].slice(0, 4),
    heavy: heavy.slice(0, 4),
  };
})()`;

const profile = mkdtempSync(join(tmpdir(), "responsive-check-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);
const stop = (code) => {
  try {
    chrome.kill("SIGKILL");
  } catch {}
  /* Chrome can still be writing its profile as it goes. */
  rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  process.exit(code);
};

let targets;
for (let attempt = 0; attempt < 40 && !targets?.length; attempt++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  } catch {}
  if (!targets?.length) await wait(250);
}
if (!targets?.length) {
  console.error("Chrome did not start.");
  stop(2);
}

const socket = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener("open", resolve));
let next = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++next;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }))
    .result.result.value;

await send("Page.enable");
let failures = 0;
let warnings = 0;

for (const size of WIDTHS) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: size.width,
    height: size.height,
    deviceScaleFactor: 2,
    mobile: size.touch,
  });
  await send("Emulation.setTouchEmulationEnabled", {
    enabled: size.touch,
    maxTouchPoints: size.touch ? 5 : 0,
  });
  console.log(`\n── ${size.width}×${size.height}${size.touch ? " touch" : ""}`);

  for (const route of ROUTES) {
    await send("Page.navigate", { url: BASE + route });
    await wait(3500);
    /* Walk the page, so whatever is laid out on the way down is measured. */
    await evaluate(`(async () => {
      const end = document.documentElement.scrollHeight;
      for (let y = 0; y < end; y += innerHeight * 0.8) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      scrollTo(0, 0);
    })()`);
    await wait(500);
    const result = await evaluate(measure(size.touch));

    const failed = result.sideways || result.spill.length || result.targetsFail.length;
    const warned =
      result.targetsWarnCount || result.smallText.length || result.heavy.length || result.zoom.length;
    if (failed) failures++;
    if (warned) warnings++;
    const mark = failed ? "FAIL" : warned ? "warn" : "ok  ";
    console.log(`${mark} ${route}`);
    if (result.sideways) console.log(`     sideways scroll: page ${result.docWidth}px wide`);
    if (result.spill.length) console.log(`     spills past the edge: ${result.spill.join(", ")}`);
    if (result.targetsFail.length) console.log(`     targets under 24px: ${result.targetsFail.join(", ")}`);
    if (result.targetsWarnCount)
      console.log(`     targets under 44px (${result.targetsWarnCount}): ${result.targetsWarn.join(", ")}`);
    if (result.smallText.length) console.log(`     text under 12px: ${result.smallText.join(", ")}`);
    if (result.heavy.length) console.log(`     heavy images: ${result.heavy.join(", ")}`);
    if (result.zoom.length) console.log(`     fields Safari will zoom into: ${result.zoom.join(", ")}`);
  }
}

console.log(`\n${failures} failing, ${warnings} with warnings.`);
socket.close();
stop(failures ? 1 : 0);
