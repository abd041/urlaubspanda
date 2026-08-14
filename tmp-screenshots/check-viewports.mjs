import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";

const widths = [
  { w: 320, h: 568 },
  { w: 344, h: 800 },
  { w: 360, h: 800 },
  { w: 375, h: 812 },
  { w: 390, h: 844 },
  { w: 414, h: 896 },
];

const outDir = "c:\\Users\\user\\Desktop\\Urlaubspanda\\tmp-screenshots";

async function analyzePage(page) {
  return page.evaluate(() => {
    function isWrapped(el) {
      if (!el) return null;
      const style = getComputedStyle(el);
      const lineHeight =
        style.lineHeight === "normal"
          ? parseFloat(style.fontSize) * 1.2
          : parseFloat(style.lineHeight);
      const height = el.getBoundingClientRect().height;
      return height > lineHeight * 1.4;
    }

    function isTextTruncated(el) {
      if (!el) return false;
      return el.scrollWidth > el.clientWidth + 1;
    }

    const heading = document.getElementById("beliebte-reiseziele-heading");
    const link = document.querySelector('a[href="/reiseziele"]');

    const carousel = document.querySelector('[aria-label="Beliebte Reiseziele"]');
    const carouselRect = carousel?.getBoundingClientRect();

    const cards = Array.from(
      document.querySelectorAll("[data-carousel-item]")
    );

    const visibleCards = cards.filter((card) => {
      if (!carouselRect) return false;
      const r = card.getBoundingClientRect();
      const tol = 2;
      return (
        r.left >= carouselRect.left - tol &&
        r.right <= carouselRect.right + tol &&
        r.top >= carouselRect.top - tol &&
        r.bottom <= carouselRect.bottom + tol &&
        r.width > 0 &&
        r.height > 0
      );
    });

    const truncatedTitles = visibleCards
      .map((card) => {
        const title = card.querySelector("h3");
        const name = title?.textContent?.trim() ?? "";
        return { name, truncated: isTextTruncated(title) };
      })
      .filter((t) => t.truncated);

    return {
      headingWraps: isWrapped(heading),
      linkWraps: isWrapped(link),
      fullyVisibleCards: visibleCards.length,
      truncatedTitles: truncatedTitles.map((t) => t.name),
      headingHeight: heading?.getBoundingClientRect().height ?? null,
      linkHeight: link?.getBoundingClientRect().height ?? null,
    };
  });
}

const results = [];

const browser = await chromium.launch({ headless: true });

for (const { w, h } of widths) {
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  const ts = Date.now();
  await page.goto(`http://localhost:3000/?t=${ts}`, {
    waitUntil: "networkidle",
  });

  // Scroll section into view
  await page.locator("#beliebte-reiseziele-heading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const analysis = await analyzePage(page);

  const screenshotPath = join(outDir, `width-${w}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false });

  results.push({
    width: w,
    height: h,
    ...analysis,
    consoleErrors: [...new Set(consoleErrors)],
    screenshot: screenshotPath,
  });

  await context.close();
}

await browser.close();

writeFileSync(join(outDir, "results.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
