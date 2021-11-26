const shell = require("shelljs");
const { getProjectInfo, getApiTransform } = require("./loader");
const { writeApiTransform } = require("./writer");

module.exports = () => {
  const projectInfo = getProjectInfo();
  const data = getApiTransform(projectInfo.projectName);
  delete data.ResolverConfig;
  writeApiTransform(JSON.stringify(data));

  console.log(
    "=================== Push After Disable Conflict Res ==================="
  );
  shell.exec(
    `amplify push --codegen '{"generateCode":true,"codeLanguage":"javascript","fileNamePattern":"src/graphql/**/*.js","generatedFileName":"API","generateDocs":true}' --yes`
  );
  console.log(
    "============================== End Push ===============================\n"
  );
};
