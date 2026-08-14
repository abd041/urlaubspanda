import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";

const viewports = [
  { width: 375, height: 900 },
  { width: 320, height: 800 },
  { width: 414, height: 900 },
];

const outDir = "c:\\Users\\user\\Desktop\\Urlaubspanda\\tmp-screenshots";
const TARGETS = ["Familienhotel", "Wellness"];

function analyzeChipText(page) {
  return page.evaluate((labels) => {
    const section = document.querySelector(
      'section[aria-labelledby="reisearten-heading"]'
    );
    if (!section) return { error: "Section not found" };

    const chipRow = section.querySelector(".flex.gap-1\\.5.md\\:hidden");
    if (!chipRow) return { error: "Chip row not found" };

    const chips = Array.from(chipRow.querySelectorAll("button"));

    const results = {};
    for (const label of labels) {
      const chip = chips.find((b) =>
        b.querySelector("span")?.textContent?.trim().includes(label)
      );
      if (!chip) {
        results[label] = { error: `Chip not found for ${label}` };
        continue;
      }

      const span = chip.querySelector("span");
      const chipRect = chip.getBoundingClientRect();
      const spanRect = span.getBoundingClientRect();
      const spanStyle = window.getComputedStyle(span);

      // Collect per-line boxes via Range API
      const text = span.textContent ?? "";
      const lines = [];
      if (span.firstChild?.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        const textNode = span.firstChild;
        let lineTop = null;
        let lineText = "";

        for (let i = 0; i < text.length; i++) {
          range.setStart(textNode, i);
          range.setEnd(textNode, i + 1);
          const rects = range.getClientRects();
          if (rects.length === 0) continue;
          const top = rects[0].top;

          if (lineTop === null || Math.abs(top - lineTop) > 2) {
            if (lineText) lines.push(lineText);
            lineTop = top;
            lineText = text[i];
          } else {
            lineText += text[i];
          }
        }
        if (lineText) lines.push(lineText);
      }

      const innerText = span.innerText;
      const visibleText = innerText.trim();
      const hasVisibleHyphen = /-\s*$/.test(lines.join("")) || visibleText.includes("-");

      const labelOutsideChip =
        spanRect.left < chipRect.left - 0.5 ||
        spanRect.right > chipRect.right + 0.5 ||
        spanRect.top < chipRect.top - 0.5 ||
        spanRect.bottom > chipRect.bottom + 0.5;

      results[label] = {
        fullText: text.trim(),
        innerText: visibleText,
        lines,
        lineCount: lines.length,
        hasVisibleHyphen,
        hyphensStyle: spanStyle.hyphens,
        wordBreak: spanStyle.wordBreak,
        overflowWrap: spanStyle.overflowWrap,
        fontSize: spanStyle.fontSize,
        chipWidth: Math.round(chipRect.width * 10) / 10,
        spanWidth: Math.round(spanRect.width * 10) / 10,
        spanHeight: Math.round(spanRect.height * 10) / 10,
        labelOutsideChip,
        overflow: labelOutsideChip
          ? "overflow"
          : lines.length === 1
            ? "single-line"
            : "wrapped",
      };
    }

    return results;
  }, TARGETS);
}

const results = [];
const browser = await chromium.launch({ headless: true });

for (const { width, height } of viewports) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    locale: "de-DE",
  });
  const page = await context.newPage();

  const ts = Date.now();
  await page.goto(`http://localhost:3000/?t=${ts}`, {
    waitUntil: "networkidle",
  });

  await page.locator("#reisearten-heading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const chipRow = page.locator(
    'section[aria-labelledby="reisearten-heading"] .flex.gap-1\\.5.md\\:hidden'
  );
  await chipRow.waitFor({ state: "visible" });

  const screenshotPath = join(outDir, `hyphen-${width}.png`);
  await chipRow.screenshot({ path: screenshotPath });

  const textAnalysis = await analyzeChipText(page);

  results.push({
    width,
    height,
    screenshot: screenshotPath,
    chips: textAnalysis,
  });

  await context.close();
}

await browser.close();

const outJson = join(outDir, "hyphen-results.json");
writeFileSync(outJson, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
