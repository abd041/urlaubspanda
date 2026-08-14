import { chromium } from "playwright";
import { writeFileSync } from "fs";
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
  { width: 414, height: 900 },
];

function rectsOverlap(a, b) {
  return !(
    a.right <= b.left ||
    a.left >= b.right ||
    a.bottom <= b.top ||
    a.top >= b.bottom
  );
}

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
    function getLineCount(el) {
      if (!el) return null;
      const style = getComputedStyle(el);
      const lineHeight =
        style.lineHeight === "normal"
          ? parseFloat(style.fontSize) * 1.2
          : parseFloat(style.lineHeight);
      const height = el.getBoundingClientRect().height;
      if (!lineHeight || Number.isNaN(lineHeight)) {
        return el.scrollHeight > el.clientHeight + 1 ? 2 : 1;
      }
      return Math.max(1, Math.round(height / lineHeight));
    }

    function getWrapInfo(el) {
      const lines = getLineCount(el);
      return { lines, wraps: lines > 1 };
    }

    const heading = document.getElementById("top-angebote-heading");
    const section = document.querySelector(
      'section[aria-labelledby="top-angebote-heading"]'
    );
    const headerBlock = heading?.closest(".min-w-0");
    const subtitle = headerBlock?.querySelector("p");
    const mobileLink = headerBlock?.querySelector('a[href="/angebote"]');

    const headingInfo = getWrapInfo(heading);

    let linkInfo = {
      found: false,
      visible: false,
      lines: null,
      wraps: null,
      overlapsHeading: null,
      truncated: null,
    };

    if (mobileLink) {
      const linkRect = mobileLink.getBoundingClientRect();
      const headingRect = heading?.getBoundingClientRect();
      const style = getComputedStyle(mobileLink);
      const visible = linkRect.width > 0 && linkRect.height > 0;
      const lines = visible ? getLineCount(mobileLink) : null;
      const overlapsHeading =
        visible && headingRect
          ? !(
              linkRect.right <= headingRect.left ||
              linkRect.left >= headingRect.right ||
              linkRect.bottom <= headingRect.top ||
              linkRect.top >= headingRect.bottom
            )
          : null;

      linkInfo = {
        found: true,
        visible,
        lines,
        wraps: lines !== null ? lines > 1 : null,
        overlapsHeading,
        truncated:
          visible && style.whiteSpace === "nowrap"
            ? mobileLink.scrollWidth > mobileLink.clientWidth + 1
            : false,
      };
    }

    return {
      headingLines: headingInfo.lines,
      headingWraps: headingInfo.wraps,
      subtitleText: subtitle?.textContent?.trim() ?? null,
      link: linkInfo,
      sectionFound: !!section,
      headerBlockFound: !!headerBlock,
    };
  });

  const headerLocator = page.locator("#top-angebote-heading").locator("xpath=ancestor::div[contains(@class,'min-w-0')][1]");
  const screenshotPath = join(outDir, `topdeals-${width}.png`);
  await headerLocator.screenshot({ path: screenshotPath });

  return {
    width,
    height,
    ...data,
    screenshot: screenshotPath,
  };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];

for (const vp of viewports) {
  try {
    const result = await analyzeViewport(page, vp.width, vp.height);
    results.push(result);
    console.log(JSON.stringify(result));
  } catch (err) {
    results.push({ width: vp.width, error: String(err) });
    console.error(`Error at ${vp.width}:`, err);
  }
}

await browser.close();
writeFileSync(
  join(outDir, "topdeals-results.json"),
  JSON.stringify(results, null, 2)
);
console.log("DONE");
