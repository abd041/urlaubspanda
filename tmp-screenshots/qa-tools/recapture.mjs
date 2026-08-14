import puppeteer from "puppeteer-core";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = "http://127.0.0.1:3018";
const out = "D:\\Urlaubspanda\\tmp-screenshots\\qa-premium";
const shots = [
  { name: "book-375-v2", w: 375, h: 1600, path: "/hotel/alpenresort-zillertal" },
  { name: "book-1440-v2", w: 1440, h: 1200, path: "/hotel/alpenresort-zillertal" },
  { name: "deals-1440", w: 1440, h: 900, path: "/", scroll: 1400 },
  { name: "deals-390", w: 390, h: 1100, path: "/", scroll: 1600 },
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
for (const s of shots) {
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1 });
  await page.goto(origin + s.path, { waitUntil: "networkidle0", timeout: 30000 });
  if (s.scroll) await page.evaluate((y) => window.scrollTo(0, y), s.scroll);
  await new Promise((r) => setTimeout(r, 400));
  const m = await page.evaluate(() => ({
    inner: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  await page.screenshot({ path: `${out}\\${s.name}.png` });
  console.log(s.name, m.inner, m.scroll, m.scroll > m.inner + 1 ? "OVERFLOW" : "ok");
}
await browser.close();
