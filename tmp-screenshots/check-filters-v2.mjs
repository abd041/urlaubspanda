import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";

const viewports = [
  { width: 320, height: 800 },
  { width: 344, height: 800 },
  { width: 360, height: 800 },
  { width: 375, height: 900 },
];

const outDir = "c:\\Users\\user\\Desktop\\Urlaubspanda\\tmp-screenshots";

function analyzeOverflow(page) {
  return page.evaluate(() => {
    const section = document.querySelector(
      'section[aria-labelledby="reisearten-heading"]'
    );
    if (!section) return { error: "Section not found" };

    const chipRow = section.querySelector(".flex.gap-1\\.5.md\\:hidden");
    if (!chipRow) return { error: "Chip row not found" };

    const chips = Array.from(chipRow.querySelectorAll("button"));
    const TOLERANCE = 0.5;

    const chipResults = chips.map((chip, index) => {
      const chipRect = chip.getBoundingClientRect();
      const labelEl = chip.querySelector("span");
      const iconEl = chip.querySelector("svg");
      const label = labelEl?.textContent?.trim() ?? "";

      const labelRect = labelEl?.getBoundingClientRect();
      const iconRect = iconEl?.getBoundingClientRect();

      const labelOverflowsChip =
        labelEl &&
        (labelEl.scrollWidth > labelEl.clientWidth + 1 ||
          labelEl.scrollHeight > labelEl.clientHeight + 1);

      const labelOutsideChipBorder =
        labelRect &&
        (labelRect.left < chipRect.left - TOLERANCE ||
          labelRect.right > chipRect.right + TOLERANCE ||
          labelRect.top < chipRect.top - TOLERANCE ||
          labelRect.bottom > chipRect.bottom + TOLERANCE);

      const iconOutsideChipBorder =
        iconRect &&
        (iconRect.left < chipRect.left - TOLERANCE ||
          iconRect.right > chipRect.right + TOLERANCE ||
          iconRect.top < chipRect.top - TOLERANCE ||
          iconRect.bottom > chipRect.bottom + TOLERANCE);

      const chipContentOverflow =
        chip.scrollWidth > chip.clientWidth + 1 ||
        chip.scrollHeight > chip.clientHeight + 1;

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
        labelOverflowsChip,
        labelOutsideChipBorder,
        iconOutsideChipBorder,
        chipContentOverflow,
        issues: [
          ...(labelOverflowsChip ? ["label text clipped/truncated inside span"] : []),
          ...(labelOutsideChipBorder ? ["label extends outside chip border"] : []),
          ...(iconOutsideChipBorder ? ["icon extends outside chip border"] : []),
          ...(chipContentOverflow ? ["chip content overflows button box"] : []),
        ],
      };
    });

    const overlaps = [];
    for (let i = 0; i < chipResults.length - 1; i++) {
      const a = chipResults[i];
      const b = chipResults[i + 1];
      const aLabel = a.labelRect;
      const bLabel = b.labelRect;
      if (!aLabel || !bLabel) continue;

      const horizontalOverlap =
        aLabel.right > bLabel.left + TOLERANCE &&
        aLabel.left < bLabel.right - TOLERANCE;
      const verticalOverlap =
        aLabel.bottom > bLabel.top + TOLERANCE &&
        aLabel.top < bLabel.bottom - TOLERANCE;

      if (horizontalOverlap && verticalOverlap) {
        overlaps.push({
          between: [a.label, b.label],
          overlapPx: {
            horizontal: Math.min(aLabel.right, bLabel.right) - Math.max(aLabel.left, bLabel.left),
            vertical: Math.min(aLabel.bottom, bLabel.bottom) - Math.max(aLabel.top, bLabel.top),
          },
        });
      }

      // Also check chip box overlap (shouldn't happen with flex gap)
      const chipOverlap =
        a.chipRect.right > b.chipRect.left + TOLERANCE &&
        a.chipRect.left < b.chipRect.right - TOLERANCE &&
        a.chipRect.bottom > b.chipRect.top + TOLERANCE &&
        a.chipRect.top < b.chipRect.bottom - TOLERANCE;
      if (chipOverlap) {
        overlaps.push({
          between: [a.label, b.label],
          type: "chip-box-overlap",
        });
      }
    }

    const chipsWithIssues = chipResults.filter((c) => c.issues.length > 0);

    return {
      chipCount: chips.length,
      labels: chipResults.map((c) => c.label),
      chipsWithIssues,
      overlaps,
      anyOverflowOrOverlap:
        chipsWithIssues.length > 0 || overlaps.length > 0,
      chipResults,
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

  const ts = Date.now();
  await page.goto(`http://localhost:3000/?t=${ts}`, {
    waitUntil: "networkidle",
  });

  await page.locator("#reisearten-heading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const analysis = await analyzeOverflow(page);

  const section = page.locator(
    'section[aria-labelledby="reisearten-heading"]'
  );
  const screenshotPath = join(outDir, `filters-v2-${width}.png`);
  await section.screenshot({ path: screenshotPath });

  const affectedChips = new Set();
  for (const c of analysis.chipsWithIssues ?? []) {
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
    chipsWithIssues: analysis.chipsWithIssues ?? [],
    overlaps: analysis.overlaps ?? [],
    labels: analysis.labels ?? [],
    screenshot: screenshotPath,
    error: analysis.error,
  });

  await context.close();
}

await browser.close();

writeFileSync(
  join(outDir, "filters-v2-results.json"),
  JSON.stringify(results, null, 2)
);
console.log(JSON.stringify(results, null, 2));
