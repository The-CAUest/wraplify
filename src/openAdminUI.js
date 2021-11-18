const inputReader = require("wait-console-input");
const puppeteer = require("puppeteer");
const { getProjectInfo } = require("./loader");
const { sleep } = require("./common");

const projectInfo = getProjectInfo();
console.log(projectInfo);

const projectAdminUIConsole = `https://${projectInfo["amplifyRegion"]}.console.aws.amazon.com/amplify/home?region=${projectInfo["amplifyRegion"]}#/${projectInfo["AmplifyAppId"]}/settings/admin-ui-management`;

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(projectAdminUIConsole);

  inputReader.readLine("Press a RETURN(ENTER) After Login!");

  await page.goto(projectAdminUIConsole, { waitUntil: "networkidle2" });

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  let adminUIToggle = await page.$(".awsui-toggle > input");
  let adminUIToggleValue = await page.evaluate((e) => e.checked, adminUIToggle);

  if (!adminUIToggleValue) {
    console.log("Enable Admin UI... Please Wait");

    await adminUIToggle.click();

    while (!adminUIToggleValue) {
      try {
        await sleep(5000);
        adminUIToggle = await page.$(".awsui-toggle > input");
        adminUIToggleValue = await page.evaluate(
          (e) => e.checked,
          adminUIToggle
        );
      } catch (e) {
        console.log(e);
        adminUIToggle = await page.$(".awsui-toggle > input");
      }
    }

    console.log("Enable Admin UI Done!");
  }

  inputReader.readLine("Press a RETURN(ENTER) To Exit!");

  await browser.close();
})();
