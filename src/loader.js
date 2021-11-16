const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const getJsonData = (filePath) => {
  const jsonPath = path.join(__dirname, filePath);
  const jsonFile = fs.readFileSync(jsonPath, "utf8");
  const jsonData = JSON.parse(jsonFile);
  return jsonData;
};

const getYamlData = (filePath) => {
  const yamlPath = path.join(__dirname, filePath);
  const yamlFile = fs.readFileSync(yamlPath, "utf8");
  const yamlData = yaml.load(yamlFile);
  return yamlData.projects;
};

exports.getProjectInfo = () => {
  const projectProviderInfo = getJsonData("./amplify/team-provider-info.json");
  const projectInfo = getJsonData("./amplify/.config/project-config.json");

  return Object.keys(projectProviderInfo).map((key) => ({
    env: key,
    amplifyRegion: projectProviderInfo[key].awscloudformation.Region,
    AmplifyAppId: projectProviderInfo[key].awscloudformation.AmplifyAppId,
    projectName: projectInfo.projectName,
  }))[0];
};

exports.getApiInfo = () => {
  const projectInfo = getYamlData("./.graphqlconfig.yml");
  console.log(projectInfo);
};
