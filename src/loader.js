const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const getJsonData = (filePath) => {
  const jsonPath = path.join(process.cwd(), filePath);
  const jsonFile = fs.readFileSync(jsonPath, "utf8");
  const jsonData = JSON.parse(jsonFile);
  return jsonData;
};

const getYamlData = (filePath) => {
  const yamlPath = path.join(process.cwd(), filePath);
  const yamlFile = fs.readFileSync(yamlPath, "utf8");
  const yamlData = yaml.load(yamlFile);
  return yamlData.projects;
};

exports.getProjectInfo = () => {
  const projectProviderInfo = getJsonData("amplify/team-provider-info.json");
  const projectInfo = getJsonData("amplify/.config/project-config.json");

  const infoArray = Object.keys(projectProviderInfo).map((key) => ({
    env: key,
    amplifyRegion: projectProviderInfo[key].awscloudformation.Region,
    AmplifyAppId: projectProviderInfo[key].awscloudformation.AmplifyAppId,
    projectName: projectInfo.projectName,
  }));
  return infoArray.find((info) => info.env === "dev");
};

exports.getApiInfo = () => {
  const projectInfo = getYamlData("./.graphqlconfig.yml");
  console.log(projectInfo);
};

exports.getApiTransform = (projectName) => {
  const data = getJsonData(
    `amplify/backend/api/${projectName}Api/transform.conf.json`
  );
  return data;
};
