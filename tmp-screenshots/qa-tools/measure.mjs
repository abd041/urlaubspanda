import puppeteer from "puppeteer-core";

const chrome =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const url =
  "http://127.0.0.1:3015/hotel/rewaya-luxury-resort";

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 1800, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 1500));

const metrics = await page.evaluate(() => {
  const main = document.querySelector("main");
  const section = document.querySelector("section");
  const steppers = [...document.querySelectorAll("button")].filter((b) =>
    (b.getAttribute("aria-label") || "").includes("erhöhen")
  );
  return {
    innerWidth: window.innerWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScroll: document.body.scrollWidth,
    mainWidth: main ? Math.round(main.getBoundingClientRect().width) : null,
    sectionWidth: section
      ? Math.round(section.getBoundingClientRect().width)
      : null,
    plusButtons: steppers.map((b) => {
      const r = b.getBoundingClientRect();
      return {
        label: b.getAttribute("aria-label"),
        left: Math.round(r.left),
        right: Math.round(r.right),
        top: Math.round(r.top),
        visible: r.right <= window.innerWidth && r.left >= 0,
      };
    }),
  };
});

console.log(JSON.stringify(metrics, null, 2));
await page.screenshot({
  path: "D:\\Urlaubspanda\\tmp-screenshots\\qa-p1\\v4-book-390-puppeteer.png",
  fullPage: false,
});
await browser.close();
