const inputReader = require("wait-console-input");
const puppeteer = require("puppeteer");
const { getProjectInfo } = require("./loader");

inputReader.readLine("Press a RETURN(ENTER) After Login!");
const projectInfo = getProjectInfo();
console.log(projectInfo);

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.naver.com");
  const loginBtn = await page.$(".link_login");
  await loginBtn.click();
  inputReader.readLine("Press a RETURN(ENTER) to continue");

  await browser.close();
})();
