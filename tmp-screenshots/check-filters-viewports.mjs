import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";

const viewports = [
  { width: 320, height: 800 },
  { width: 344, height: 800 },
  { width: 360, height: 800 },
  { width: 375, height: 900 },
  { width: 390, height: 900 },
  { width: 414, height: 900 },
];

const outDir = "c:\\Users\\user\\Desktop\\Urlaubspanda\\tmp-screenshots";

async function analyzeFilters(page) {
  return page.evaluate(() => {
    const section = document.querySelector(
      'section[aria-labelledby="reisearten-heading"]'
    );
    if (!section) {
      return { error: "Section not found" };
    }

    // Mobile filter row: flex gap-1.5 md:hidden
    const chipRow = section.querySelector(".flex.gap-1\\.5.md\\:hidden");
    if (!chipRow) {
      return { error: "Chip row not found" };
    }

    const chips = Array.from(chipRow.querySelectorAll("button"));
    const viewportWidth = window.innerWidth;

    const chipData = chips.map((chip) => {
      const rect = chip.getBoundingClientRect();
      const labelEl = chip.querySelector("span");
      const label = labelEl?.textContent?.trim() ?? "";
      const labelTruncated =
        labelEl ? labelEl.scrollWidth > labelEl.clientWidth + 1 : false;
      const chipTruncated =
        chip.scrollWidth > chip.clientWidth + 1 ||
        chip.scrollHeight > chip.clientHeight + 1;
      return {
        label,
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        labelTruncated,
        chipTruncated,
        fullyVisibleInViewport:
          rect.left >= 0 &&
          rect.right <= viewportWidth &&
          rect.width > 0 &&
          rect.height > 0,
      };
    });

    const rowRect = chipRow.getBoundingClientRect();
    const tops = chipData.map((c) => c.top);
    const minTop = Math.min(...tops);
    const maxTop = Math.max(...tops);
    const topSpread = maxTop - minTop;

    // Single row: all chips share roughly the same top (within half chip height)
    const avgHeight =
      chipData.reduce((s, c) => s + c.height, 0) / chipData.length || 0;
    const singleRow = topSpread <= avgHeight * 0.5;

    const allSixVisible = chipData.length === 6;
    const allInViewport = chipData.every((c) => c.fullyVisibleInViewport);

    const rowOverflowsViewport =
      rowRect.right > viewportWidth + 1 || rowRect.left < -1;
    const rowScrollable =
      chipRow.scrollWidth > chipRow.clientWidth + 1;

    const anyTruncation = chipData.some(
      (c) => c.labelTruncated || c.chipTruncated
    );

    return {
      chipCount: chips.length,
      labels: chipData.map((c) => c.label),
      singleRow,
      topSpread,
      allSixVisible,
      allInViewport,
      rowOverflowsViewport,
      rowScrollable,
      anyTruncation,
      truncationDetails: chipData
        .filter((c) => c.labelTruncated || c.chipTruncated)
        .map((c) => c.label),
      rowWidth: rowRect.width,
      rowRight: rowRect.right,
      viewportWidth,
      chipData,
    };
  });
}

const results = [];
const browser = await chromium.launch({ headless: true });

for (const { width, height } of viewports) {
  const context = await browser.newContext({
    viewport: { width, height },
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

  await page.locator("#reisearten-heading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const analysis = await analyzeFilters(page);

  const section = page.locator(
    'section[aria-labelledby="reisearten-heading"]'
  );
  const screenshotPath = join(outDir, `filters-${width}.png`);
  await section.screenshot({ path: screenshotPath });

  const allFitOneRow =
    analysis.error
      ? false
      : analysis.singleRow &&
        analysis.allSixVisible &&
        analysis.allInViewport &&
        !analysis.rowOverflowsViewport &&
        !analysis.rowScrollable;

  results.push({
    width,
    height,
    allFitOneRow,
    labels: analysis.labels ?? [],
    anyTruncation: analysis.anyTruncation ?? false,
    truncationDetails: analysis.truncationDetails ?? [],
    singleRow: analysis.singleRow,
    allSixVisible: analysis.allSixVisible,
    allInViewport: analysis.allInViewport,
    rowOverflowsViewport: analysis.rowOverflowsViewport,
    rowScrollable: analysis.rowScrollable,
    rowWidth: analysis.rowWidth,
    rowRight: analysis.rowRight,
    viewportWidth: analysis.viewportWidth,
    consoleErrors: [...new Set(consoleErrors)],
    screenshot: screenshotPath,
    error: analysis.error,
  });

  await context.close();
}

await browser.close();

writeFileSync(
  join(outDir, "filters-results.json"),
  JSON.stringify(results, null, 2)
);
console.log(JSON.stringify(results, null, 2));
