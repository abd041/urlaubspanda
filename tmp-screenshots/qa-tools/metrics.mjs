import puppeteer from "puppeteer-core";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();

async function measure(width, path) {
  await page.setViewport({ width, height: 1800, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:3016" + path, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });
  await new Promise((r) => setTimeout(r, 800));
  return page.evaluate(() => {
    const plus = [...document.querySelectorAll("button")].filter((b) =>
      (b.getAttribute("aria-label") || "").includes("erhöhen")
    );
    const cta = document.querySelector("#mobile-cta-anchor a, #mobile-cta-anchor button");
    const intro = [...document.querySelectorAll("p")].find((p) =>
      (p.textContent || "").includes("Wunschzeitraum")
    );
    const locations = [...document.querySelectorAll("span")].filter((s) =>
      (s.textContent || "").includes("Rhodos")
    );
    const alle = [...document.querySelectorAll("a")].find((a) =>
      (a.textContent || "").includes("Alle Reiseziele")
    );
    const highlights = document.getElementById("highlights-heading");
    const bestPrice = [...document.querySelectorAll("p")].filter((p) =>
      (p.textContent || "").includes("Bester Preis heute")
    );
    const airports = document.body.innerText.includes("alle Flughäfen");
    const cancel14 = document.body.innerText.includes("14 Tage");
    return {
      inner: window.innerWidth,
      scroll: document.documentElement.scrollWidth,
      plus: plus.map((b) => {
        const r = b.getBoundingClientRect();
        return {
          label: b.getAttribute("aria-label"),
          right: Math.round(r.right),
          visible: r.right <= window.innerWidth - 4 && r.width >= 40,
        };
      }),
      ctaH: cta ? Math.round(cta.getBoundingClientRect().height) : null,
      introOk: intro ? intro.scrollWidth <= intro.clientWidth + 1 : null,
      alleOk: alle ? !alle.className.includes("truncate") && alle.scrollWidth <= alle.clientWidth + 2 : null,
      highlights: Boolean(highlights),
      bestPriceCount: bestPrice.filter((p) => {
        const r = p.getBoundingClientRect();
        const cs = getComputedStyle(p);
        return cs.display !== "none" && r.height > 0;
      }).length,
      airports,
      cancel14,
      rhodos: locations.map((s) => s.textContent.trim()),
    };
  });
}

for (const [w, path] of [
  [375, "/hotel/rewaya-luxury-resort"],
  [390, "/hotel/rewaya-luxury-resort"],
  [430, "/hotel/rewaya-luxury-resort"],
  [390, "/"],
  [390, "/griechenland"],
  [390, "/angebot/alpenresort-zillertal"],
  [390, "/angebot/rewaya-luxury-resort"],
]) {
  const m = await measure(w, path);
  console.log(w + path, JSON.stringify(m));
}

await browser.close();
