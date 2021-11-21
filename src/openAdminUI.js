const inputReader = require("wait-console-input");
const puppeteer = require("puppeteer");
const { getProjectInfo } = require("./loader");
const { sleep } = require("./common");

const projectAdminUIConsole = () => {
  const projectInfo = getProjectInfo();
  return `https://${projectInfo["amplifyRegion"]}.console.aws.amazon.com/amplify/home?region=${projectInfo["amplifyRegion"]}#/${projectInfo["AmplifyAppId"]}/settings/admin-ui-management`;
};
const projectConsole = () => {
  const projectInfo = getProjectInfo();
  return `https://${projectInfo["amplifyRegion"]}.console.aws.amazon.com/amplify/home?region=${projectInfo["amplifyRegion"]}#/${projectInfo["AmplifyAppId"]}`;
};
const projectAdminUIDataPage = () => {
  const projectInfo = getProjectInfo();
  return `https://${projectInfo["amplifyRegion"]}.admin.amplifyapp.com/admin/${projectInfo["AmplifyAppId"]}/dev/datastore`;
};

const activateAdminUI = async (page) => {
  console.log("Check Admin Ui is activated");

  await page.goto(projectAdminUIConsole(), { waitUntil: "networkidle2" });

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  let adminUIToggle = await page.$(".awsui-toggle > input");
  let adminUIToggleValue = await page.evaluate((e) => e.checked, adminUIToggle);

  if (!adminUIToggleValue) {
    console.log(" > Enable Admin UI...");

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

    console.log(" > Enable Admin UI - Done");
  }
  console.log("Check Admin Ui is activated - Done");
};

const openAdminUIPage = async (browser, page) => {
  console.log("Open Admin UI Page");

  await sleep(2500);

  await page.goto(projectAdminUIConsole(), { waitUntil: "networkidle2" });
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  await sleep(2500);

  await page.goto(projectConsole(), { waitUntil: "networkidle2" });

  await page.waitForSelector(".amplify-backend__placeholder button", {
    waitUntil: "networkidle2",
  });

  const openAdminUIBtn = await page.$(".amplify-backend__placeholder button");

  await openAdminUIBtn.click();

  const target = await new Promise((resolve) =>
    browser.once("targetcreated", resolve)
  );

  const newPage = await target.page();
  newPage.setViewport({
    width: 1920,
    height: 1080,
  });

  await newPage.waitForNavigation({ waitUntil: "networkidle2" });

  await newPage.bringToFront();

  console.log("Goto Admin UI Page - Done");

  return newPage;
};

const openDataEditPage = async (page) => {
  console.log("Open Data Edit Page");

  await page.goto(projectAdminUIDataPage(), { waitUntil: "networkidle2" });

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  console.log(
    " > ( Enable DataStore and deploy ) > Edit Data Model > Save And Deploy"
  );

  inputReader.readLine(
    "Press a RETURN(ENTER) after Save And Deploy Completed."
  );
};

module.exports = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1080"],
  });
  let page = await browser.newPage();
  page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.goto(projectAdminUIConsole());

  inputReader.readLine("Press a RETURN(ENTER) After Login!");

  await activateAdminUI(page);

  page = await openAdminUIPage(browser, page);

  await openDataEditPage(page);

  await browser.close();
};
