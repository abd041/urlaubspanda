import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;

const viewports = [
  { width: 320, height: 568 },
  { width: 344, height: 800 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
];

function elementWraps(el) {
  if (!el) return null;
  const style = window.getComputedStyle(el);
  const lineHeight = parseFloat(style.lineHeight);
  const height = el.getBoundingClientRect().height;
  if (!lineHeight || Number.isNaN(lineHeight)) {
    return el.scrollHeight > el.clientHeight + 1;
  }
  return height > lineHeight * 1.25;
}

function isTruncated(el) {
  if (!el) return null;
  return el.scrollWidth > el.clientWidth + 1;
}

async function verifyViewport(page, width, height) {
  const timestamp = Date.now();
  await page.setViewportSize({ width, height });
  await page.goto(`http://localhost:3000/?t=${timestamp}`, {
    waitUntil: "networkidle",
  });

  await page.waitForSelector("#beliebte-reiseziele-heading", { state: "visible" });

  const data = await page.evaluate(() => {
    const heading = document.querySelector("#beliebte-reiseziele-heading");
    const section = document.querySelector(
      'section[aria-labelledby="beliebte-reiseziele-heading"]'
    );
    const link = document.querySelector('a[href="/reiseziele"]');

    const headingWraps = (() => {
      if (!heading) return null;
      const style = window.getComputedStyle(heading);
      const lineHeight = parseFloat(style.lineHeight);
      const height = heading.getBoundingClientRect().height;
      if (!lineHeight || Number.isNaN(lineHeight)) {
        return heading.scrollHeight > heading.clientHeight + 1;
      }
      return height > lineHeight * 1.25;
    })();

    const linkInfo = (() => {
      if (!link) return { text: null, wraps: null };
      const spans = [...link.querySelectorAll("span")].filter(
        (s) => s.offsetParent !== null || s.getClientRects().length > 0
      );
      const visibleSpan = spans.find((s) => {
        const rect = s.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      const text = visibleSpan?.textContent?.trim() ?? link.textContent?.trim() ?? "";
      const style = window.getComputedStyle(link);
      const lineHeight = parseFloat(style.lineHeight);
      const height = link.getBoundingClientRect().height;
      const wraps =
        style.whiteSpace === "nowrap"
          ? false
          : !lineHeight || Number.isNaN(lineHeight)
            ? link.scrollHeight > link.clientHeight + 1
            : height > lineHeight * 1.25;
      return { text, wraps };
    })();

    const cardTitles = ["Österreich", "Griechenland", "Italien"].map((name) => {
      const cards = [...document.querySelectorAll("[data-carousel-item]")];
      const card = cards.find((c) => c.textContent?.includes(name));
      const titleEl = card?.querySelector("h3");
      const fullyVisible = titleEl
        ? titleEl.scrollWidth <= titleEl.clientWidth + 1
        : null;
      return { name, fullyVisible, found: !!titleEl };
    });

    return {
      headingWraps,
      linkText: linkInfo.text,
      linkWraps: linkInfo.wraps,
      cardTitles,
      sectionFound: !!section,
    };
  });

  const section = page.locator(
    'section[aria-labelledby="beliebte-reiseziele-heading"]'
  );
  await section.screenshot({
    path: join(outDir, `verify-${width}.png`),
  });

  return {
    width,
    headingWraps: data.headingWraps,
    linkText: data.linkText,
    linkWraps: data.linkWraps,
    cardTitlesFullyVisible: data.cardTitles.every((c) => c.fullyVisible === true),
    cardTitleDetails: data.cardTitles,
  };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];

for (const vp of viewports) {
  try {
    const result = await verifyViewport(page, vp.width, vp.height);
    results.push(result);
    console.log(JSON.stringify(result));
  } catch (err) {
    results.push({ width: vp.width, error: String(err) });
    console.error(`Error at ${vp.width}:`, err);
  }
}

await browser.close();
writeFileSync(join(outDir, "verify-results.json"), JSON.stringify(results, null, 2));
console.log("DONE");
