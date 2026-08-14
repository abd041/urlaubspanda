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
const TOLERANCE = 0.5;

function rectsOverlap(a, b) {
  return (
    a.right > b.left + TOLERANCE &&
    a.left < b.right - TOLERANCE &&
    a.bottom > b.top + TOLERANCE &&
    a.top < b.bottom - TOLERANCE
  );
}

function rectOutsideContainer(inner, outer) {
  return (
    inner.left < outer.left - TOLERANCE ||
    inner.right > outer.right + TOLERANCE ||
    inner.top < outer.top - TOLERANCE ||
    inner.bottom > outer.bottom + TOLERANCE
  );
}

function analyzeGeometry(page) {
  return page.evaluate(
    ({ tolerance }) => {
      const section = document.querySelector(
        'section[aria-labelledby="reisearten-heading"]'
      );
      if (!section) return { error: "Section not found" };

      const chipRow = section.querySelector(".flex.gap-1\\.5.md\\:hidden");
      if (!chipRow) return { error: "Chip row not found" };

      const chips = Array.from(chipRow.querySelectorAll("button"));

      const chipResults = chips.map((chip, index) => {
        const chipRect = chip.getBoundingClientRect();
        const labelEl = chip.querySelector("span");
        const label = labelEl?.textContent?.trim() ?? "";
        const labelRect = labelEl?.getBoundingClientRect();

        const labelOutsideChip =
          labelRect &&
          (labelRect.left < chipRect.left - tolerance ||
            labelRect.right > chipRect.right + tolerance ||
            labelRect.top < chipRect.top - tolerance ||
            labelRect.bottom > chipRect.bottom + tolerance);

        return {
          index,
          label,
          chipRect: {
            left: chipRect.left,
            right: chipRect.right,
            top: chipRect.top,
            bottom: chipRect.bottom,
            width: chipRect.width,
            height: chipRect.height,
          },
          labelRect: labelRect
            ? {
                left: labelRect.left,
                right: labelRect.right,
                top: labelRect.top,
                bottom: labelRect.bottom,
                width: labelRect.width,
                height: labelRect.height,
              }
            : null,
          labelOutsideChip,
        };
      });

      const overlaps = [];

      for (let i = 0; i < chipResults.length - 1; i++) {
        const a = chipResults[i];
        const b = chipResults[i + 1];

        const chipOverlap =
          a.chipRect.right > b.chipRect.left + tolerance &&
          a.chipRect.left < b.chipRect.right - tolerance &&
          a.chipRect.bottom > b.chipRect.top + tolerance &&
          a.chipRect.top < b.chipRect.bottom - tolerance;

        if (chipOverlap) {
          overlaps.push({
            type: "chip-box",
            between: [a.label, b.label],
            overlapPx: {
              horizontal:
                Math.min(a.chipRect.right, b.chipRect.right) -
                Math.max(a.chipRect.left, b.chipRect.left),
              vertical:
                Math.min(a.chipRect.bottom, b.chipRect.bottom) -
                Math.max(a.chipRect.top, b.chipRect.top),
            },
          });
        }

        if (a.labelRect && b.labelRect) {
          const labelOverlap =
            a.labelRect.right > b.labelRect.left + tolerance &&
            a.labelRect.left < b.labelRect.right - tolerance &&
            a.labelRect.bottom > b.labelRect.top + tolerance &&
            a.labelRect.top < b.labelRect.bottom - tolerance;

          if (labelOverlap) {
            overlaps.push({
              type: "label-box",
              between: [a.label, b.label],
              overlapPx: {
                horizontal:
                  Math.min(a.labelRect.right, b.labelRect.right) -
                  Math.max(a.labelRect.left, b.labelRect.left),
                vertical:
                  Math.min(a.labelRect.bottom, b.labelRect.bottom) -
                  Math.max(a.labelRect.top, b.labelRect.top),
              },
            });
          }
        }
      }

      const overflowChips = chipResults.filter((c) => c.labelOutsideChip);

      return {
        chipCount: chips.length,
        labels: chipResults.map((c) => c.label),
        overflowChips: overflowChips.map((c) => ({
          label: c.label,
          chipRect: c.chipRect,
          labelRect: c.labelRect,
        })),
        overlaps,
        anyOverflowOrOverlap: overflowChips.length > 0 || overlaps.length > 0,
      };
    },
    { tolerance: TOLERANCE }
  );
}

const results = [];
const browser = await chromium.launch({ headless: true });

for (const { width, height } of viewports) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const ts = Date.now();
  await page.goto(`http://localhost:3000/?t=${ts}`, {
    waitUntil: "networkidle",
  });

  await page.locator("#reisearten-heading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const analysis = await analyzeGeometry(page);

  const section = page.locator(
    'section[aria-labelledby="reisearten-heading"]'
  );
  const screenshotPath = join(outDir, `filters-v3-${width}.png`);
  await section.screenshot({ path: screenshotPath });

  const affectedChips = new Set();
  for (const c of analysis.overflowChips ?? []) {
    affectedChips.add(c.label);
  }
  for (const o of analysis.overlaps ?? []) {
    for (const name of o.between) affectedChips.add(name);
  }

  results.push({
    width,
    height,
    anyOverflowOrOverlap: analysis.anyOverflowOrOverlap ?? false,
    affectedChips: [...affectedChips],
    overflowChips: analysis.overflowChips ?? [],
    overlaps: analysis.overlaps ?? [],
    labels: analysis.labels ?? [],
    screenshot: screenshotPath,
    error: analysis.error,
  });

  await context.close();
}

await browser.close();

writeFileSync(
  join(outDir, "filters-v3-results.json"),
  JSON.stringify(results, null, 2)
);
console.log(JSON.stringify(results, null, 2));
