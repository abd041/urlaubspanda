import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;

const viewports = [
  { width: 320, height: 900 },
  { width: 344, height: 900 },
  { width: 360, height: 900 },
  { width: 375, height: 900 },
  { width: 390, height: 900 },
  { width: 400, height: 900 },
  { width: 414, height: 900 },
  { width: 428, height: 900 },
];

async function analyzeViewport(page, width, height) {
  const timestamp = Date.now();
  await page.setViewportSize({ width, height });
  await page.goto(`http://localhost:3000/?t=${timestamp}`, {
    waitUntil: "networkidle",
  });

  await page.waitForSelector("#top-angebote-heading", { state: "visible" });
  await page.locator("#top-angebote-heading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const data = await page.evaluate(() => {
    function getLineHeight(el) {
      const style = getComputedStyle(el);
      if (style.lineHeight === "normal") {
        return parseFloat(style.fontSize) * 1.2;
      }
      return parseFloat(style.lineHeight);
    }

    function isOneLine(el) {
      if (!el) return null;
      const lineHeight = getLineHeight(el);
      const rect = el.getBoundingClientRect();
      const height = rect.height;
      // Allow small tolerance for subpixel rounding
      const tolerance = 2;
      const singleLine = height <= lineHeight + tolerance;
      const scrollWraps = el.scrollHeight > el.clientHeight + 1;
      return {
        isOneLine: singleLine && !scrollWraps,
        height,
        lineHeight,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      };
    }

    function rectsOverlap(a, b) {
      if (!a || !b) return null;
      return !(
        a.right <= b.left ||
        a.left >= b.right ||
        a.bottom <= b.top ||
        a.top >= b.bottom
      );
    }

    const heading = document.getElementById("top-angebote-heading");
    const row = heading?.parentElement;
    const container = heading?.closest(".min-w-0");

    // Mobile "Alle anzeigen" link: sibling in the heading row, visible below sm
    const link = row?.querySelector('a[href="/angebote"]');

    const headingRect = heading?.getBoundingClientRect();
    const linkRect = link?.getBoundingClientRect();
    const containerRect = container?.getBoundingClientRect();
    const rowRect = row?.getBoundingClientRect();

    const headingLine = isOneLine(heading);

    const linkVisible =
      link &&
      linkRect &&
      linkRect.width > 0 &&
      linkRect.height > 0 &&
      getComputedStyle(link).display !== "none" &&
      getComputedStyle(link).visibility !== "hidden";

    const overlapsLink =
      linkVisible && headingRect
        ? rectsOverlap(headingRect, linkRect)
        : null;

    const overflowsContainer =
      headingRect && containerRect
        ? headingRect.right > containerRect.right + 0.5
        : null;

    const overflowsViewport =
      headingRect ? headingRect.right > window.innerWidth + 0.5 : null;

    const overflowsRow =
      headingRect && rowRect
        ? headingRect.right > rowRect.right + 0.5
        : null;

    const textTruncated =
      heading ? heading.scrollWidth > heading.clientWidth + 1 : null;

    return {
      headingText: heading?.textContent?.trim() ?? null,
      headingLine,
      linkFound: !!link,
      linkVisible,
      linkText: link?.textContent?.trim() ?? null,
      overlapsLink,
      overflowsContainer,
      overflowsRow,
      overflowsViewport,
      textTruncated,
      geometry: {
        heading: headingRect
          ? {
              left: headingRect.left,
              right: headingRect.right,
              top: headingRect.top,
              bottom: headingRect.bottom,
              width: headingRect.width,
              height: headingRect.height,
            }
          : null,
        link: linkRect
          ? {
              left: linkRect.left,
              right: linkRect.right,
              top: linkRect.top,
              bottom: linkRect.bottom,
              width: linkRect.width,
              height: linkRect.height,
            }
          : null,
        container: containerRect
          ? {
              left: containerRect.left,
              right: containerRect.right,
              width: containerRect.width,
            }
          : null,
        row: rowRect
          ? {
              left: rowRect.left,
              right: rowRect.right,
              width: rowRect.width,
            }
          : null,
        viewportWidth: window.innerWidth,
      },
    };
  });

  const rowLocator = page
    .locator("#top-angebote-heading")
    .locator("xpath=ancestor::div[contains(@class,'flex')][1]");

  const screenshotPath = join(outDir, `onelinefit-${width}.png`);
  await rowLocator.screenshot({
    path: screenshotPath,
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
  });

  return {
    width,
    height,
    headingIsOneLine: data.headingLine?.isOneLine ?? null,
    overlapsLink: data.overlapsLink,
    overflowsContainer:
      data.overflowsContainer || data.overflowsViewport || data.overflowsRow,
    ...data,
    screenshot: screenshotPath,
  };
}

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];

for (const vp of viewports) {
  try {
    const result = await analyzeViewport(page, vp.width, vp.height);
    results.push(result);
    console.log(
      JSON.stringify({
        width: result.width,
        headingIsOneLine: result.headingIsOneLine,
        overlapsLink: result.overlapsLink,
        overflowsContainer: result.overflowsContainer,
      })
    );
  } catch (err) {
    results.push({ width: vp.width, error: String(err) });
    console.error(`Error at ${vp.width}:`, err);
  }
}

await browser.close();
writeFileSync(
  join(outDir, "onelinefit-results.json"),
  JSON.stringify(results, null, 2)
);
console.log("DONE");
