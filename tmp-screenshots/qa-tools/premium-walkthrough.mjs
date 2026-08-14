import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = "http://127.0.0.1:3017";
const outDir = "D:\\Urlaubspanda\\tmp-screenshots\\qa-premium";

const shots = [
  { name: "home-1440", w: 1440, h: 900, path: "/" },
  { name: "home-1280", w: 1280, h: 900, path: "/" },
  { name: "home-1024", w: 1024, h: 900, path: "/" },
  { name: "home-768", w: 768, h: 1100, path: "/" },
  { name: "home-430", w: 430, h: 1100, path: "/" },
  { name: "home-390", w: 390, h: 1100, path: "/" },
  { name: "home-375", w: 375, h: 1100, path: "/" },
  { name: "at-1440", w: 1440, h: 1200, path: "/oesterreich" },
  { name: "at-wellness-1440", w: 1440, h: 1200, path: "/oesterreich/wellness" },
  { name: "at-wellness-390", w: 390, h: 1600, path: "/oesterreich/wellness" },
  { name: "offer-1440", w: 1440, h: 1200, path: "/angebot/alpenresort-zillertal" },
  { name: "offer-430", w: 430, h: 1800, path: "/angebot/alpenresort-zillertal" },
  { name: "offer-390", w: 390, h: 1800, path: "/angebot/alpenresort-zillertal" },
  { name: "offer-375", w: 375, h: 1800, path: "/angebot/alpenresort-zillertal" },
  { name: "book-1440", w: 1440, h: 1200, path: "/hotel/alpenresort-zillertal" },
  { name: "book-1024", w: 1024, h: 1100, path: "/hotel/alpenresort-zillertal" },
  { name: "book-768", w: 768, h: 1400, path: "/hotel/alpenresort-zillertal" },
  { name: "book-430", w: 430, h: 1600, path: "/hotel/alpenresort-zillertal" },
  { name: "book-390", w: 390, h: 1600, path: "/hotel/alpenresort-zillertal" },
  { name: "book-375", w: 375, h: 1600, path: "/hotel/alpenresort-zillertal" },
  { name: "rewaya-1440", w: 1440, h: 1200, path: "/angebot/rewaya-luxury-resort" },
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--hide-scrollbars"],
});

await mkdir(outDir, { recursive: true });
const page = await browser.newPage();
let failed = 0;

for (const shot of shots) {
  await page.setViewport({ width: shot.w, height: shot.h, deviceScaleFactor: 1 });
  await page.goto(origin + shot.path, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 500));
  const metrics = await page.evaluate(() => ({
    inner: window.innerWidth,
    scroll: document.documentElement.scrollWidth,
    broken: [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).length,
  }));
  const overflow = metrics.scroll > metrics.inner + 1;
  if (overflow) failed += 1;
  await page.screenshot({ path: `${outDir}\\${shot.name}.png`, fullPage: false });
  console.log(
    `${shot.name} ${shot.w} inner=${metrics.inner} scroll=${metrics.scroll} brokenImgs=${metrics.broken}${overflow ? " OVERFLOW" : " ok"}`
  );
}

await browser.close();
if (failed) {
  console.error(`OVERFLOW COUNT: ${failed}`);
  process.exit(1);
}
console.log("All viewports ok");
