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

const width = 1920;
const height = 800;

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

  await page.goto(projectConsole(), { waitUntil: "networkidle2" });

  await page.waitForSelector(".amplify-backend__placeholder button", {
    waitUntil: "networkidle2",
  });

  const cnt = 3;
  let newPage;
  for (let i = 0; i < cnt; i++) {
    const openAdminUIBtn = await page.$(".amplify-backend__placeholder button");

    await openAdminUIBtn.click();

    const target = await new Promise((resolve) =>
      browser.once("targetcreated", resolve)
    );

    newPage = await target.page();
    newPage.setViewport({
      width,
      height,
    });

    try {
      await newPage.waitForNavigation({ waitUntil: "networkidle2" });
    } catch {
      await sleep(3000);
      await newPage.close();
      continue;
    }

    await sleep(3000);

    await newPage.bringToFront();

    if (i === cnt - 1) break;

    await newPage.close();
  }

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
    args: [`--window-size=${width},${height}`],
  });
  let page = await browser.newPage();
  page.setViewport({
    width,
    height,
  });
  await page.goto(projectAdminUIConsole());

  inputReader.readLine("Press a RETURN(ENTER) After Login!");

  await activateAdminUI(page);

  page = await openAdminUIPage(browser, page);

  await openDataEditPage(page);

  await browser.close();
};
