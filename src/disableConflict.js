const { getProjectInfo, getApiTransform } = require("./loader");
const { writeApiTransform } = require("./writer");

module.exports = () => {
  const projectInfo = getProjectInfo();
  const data = getApiTransform(projectInfo.projectName);
  delete data.ResolverConfig;
  writeApiTransform(JSON.stringify(data));
};
