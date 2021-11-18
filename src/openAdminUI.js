const inputReader = require("wait-console-input");
const puppeteer = require("puppeteer");

console.log(123);
inputReader.readLine("Press a RETURN(ENTER) to continue");
console.log(12312412);

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.naver.com");
  await page.screenshot({ path: "example.png" });

  await browser.close();
})();
