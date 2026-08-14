import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = "http://127.0.0.1:3016";
const outDir = "D:\\Urlaubspanda\\tmp-screenshots\\qa-p1";

const shots = [
  { name: "p-home-1440", w: 1440, h: 900, path: "/" },
  { name: "p-home-1280", w: 1280, h: 900, path: "/" },
  { name: "p-home-1024", w: 1024, h: 900, path: "/" },
  { name: "p-home-768", w: 768, h: 1100, path: "/" },
  { name: "p-home-430", w: 430, h: 1100, path: "/" },
  { name: "p-home-390", w: 390, h: 1100, path: "/" },
  { name: "p-home-375", w: 375, h: 1100, path: "/" },
  { name: "p-at-1440", w: 1440, h: 1400, path: "/oesterreich" },
  { name: "p-at-1280", w: 1280, h: 1200, path: "/oesterreich" },
  { name: "p-at-1024", w: 1024, h: 1200, path: "/oesterreich" },
  { name: "p-at-768", w: 768, h: 1400, path: "/oesterreich" },
  { name: "p-at-390", w: 390, h: 1800, path: "/oesterreich" },
  { name: "p-gr-1440", w: 1440, h: 1400, path: "/griechenland" },
  { name: "p-offer-1440", w: 1440, h: 1200, path: "/angebot/alpenresort-zillertal" },
  { name: "p-offer-390", w: 390, h: 2800, path: "/angebot/alpenresort-zillertal" },
  { name: "p-offer-375", w: 375, h: 2800, path: "/angebot/alpenresort-zillertal" },
  { name: "p-offer-430", w: 430, h: 2800, path: "/angebot/alpenresort-zillertal" },
  { name: "p-book-1440", w: 1440, h: 1200, path: "/hotel/rewaya-luxury-resort" },
  { name: "p-book-1280", w: 1280, h: 1100, path: "/hotel/rewaya-luxury-resort" },
  { name: "p-book-1024", w: 1024, h: 1100, path: "/hotel/rewaya-luxury-resort" },
  { name: "p-book-768", w: 768, h: 1600, path: "/hotel/alpenresort-zillertal" },
  { name: "p-book-430", w: 430, h: 1800, path: "/hotel/rewaya-luxury-resort" },
  { name: "p-book-390", w: 390, h: 1800, path: "/hotel/rewaya-luxury-resort" },
  { name: "p-book-375", w: 375, h: 1800, path: "/hotel/rewaya-luxury-resort" },
  { name: "p-book-at-390", w: 390, h: 1800, path: "/hotel/alpenresort-zillertal" },
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--hide-scrollbars"],
});

await mkdir(outDir, { recursive: true });
const page = await browser.newPage();

for (const shot of shots) {
  await page.setViewport({ width: shot.w, height: shot.h, deviceScaleFactor: 1 });
  await page.goto(origin + shot.path, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  const metrics = await page.evaluate(() => ({
    inner: window.innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  const overflow = metrics.scroll > metrics.inner + 1;
  await page.screenshot({ path: `${outDir}\\${shot.name}.png`, fullPage: false });
  console.log(
    `${shot.name} ${shot.w} inner=${metrics.inner} scroll=${metrics.scroll}${overflow ? " OVERFLOW" : " ok"}`
  );
}

await browser.close();
