const shell = require("shelljs");
const {
  writeHeadlessAuth,
  writeHeadlessApi,
  writeGQLConfig,
} = require("./writer");
const deleteFile = require("./remover");

module.exports = () => {
  const stdinCommand = process.platform === "win32" ? "type" : "cat";

  console.log("=================== start Init ===================");
  shell.exec(
    `amplify init --frontend '{"frontend":"javascript","framework":"react"}' --yes`
  );
  console.log("=================== end Init ===================\n");

  console.log("=================== start Auth ===================");
  writeHeadlessAuth();
  shell.exec(`${stdinCommand} headlessAuth.json | amplify add auth --headless`);
  deleteFile("headlessAuth.json");
  console.log("=================== end Auth ===================\n");

  console.log("=================== start Api ===================");
  writeHeadlessApi();
  shell.exec(`${stdinCommand} headlessApi.json | amplify add api --headless`);
  deleteFile("headlessApi.json");
  console.log("=================== end Api ===================\n");

  writeGQLConfig();

  console.log("=================== start Push ===================");
  shell.exec(
    `amplify push --codegen '{"generateCode":true,"codeLanguage":"javascript","fileNamePattern":"src/graphql/**/*.js","generatedFileName":"API","generateDocs":true}' --yes`
  );
  console.log("=================== end Push ===================\n");
};
