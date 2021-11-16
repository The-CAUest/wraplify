const fs = require("fs");
const path = require("path");
const { getProjectInfo } = require("./loader");

exports.writeHeadlessApi = () => {
  const projectInfo = getProjectInfo();

  const headlessApiPath = path.join(__dirname, "./headlessApi.json");
  const headlessApiData = `{"version":1,"serviceConfiguration":{"serviceName":"AppSync","apiName":"${projectInfo.projectName}Api","transformSchema":"type Todo @model {\r\n  id: ID!\r\n  name: String!\r\n  description: String\r\n}","defaultAuthType":{"mode":"AMAZON_COGNITO_USER_POOLS"},"additionalAuthTypes":[{"mode":"API_KEY"}]}}`;
  fs.writeFileSync(headlessApiPath, headlessApiData);
};

exports.writeHeadlessAuth = () => {
  const projectInfo = getProjectInfo();

  const headlessAuthPath = path.join(__dirname, "./headlessAuth.json");
  const headlessAuthData = `{"version":1,"resourceName":"${projectInfo.projectName}Auth","serviceConfiguration":{"serviceName":"Cognito","userPoolConfiguration":{"signinMethod":"USERNAME","requiredSignupAttributes":["EMAIL","NAME","PHONE_NUMBER"]},"includeIdentityPool":true}}`;
  fs.writeFileSync(headlessAuthPath, headlessAuthData);
};

exports.writeGQLConfig = () => {
  const projectInfo = getProjectInfo();
  const apiName = `${projectInfo.projectName}Api`;
  const apiRegion = projectInfo.amplifyRegion;

  const configPath = path.join(__dirname, "./.graphqlconfig.yml");
  const configData = `projects:
  ${apiName}:
    schemaPath: amplify/backend/api/${apiName}/build/schema.graphql
    includes:
      - src/graphql/**/*.js
    excludes:
      - ./amplify/**
    extensions:
      amplify:
        codeGenTarget: javascript
        generatedFileName: ""
        docsFilePath: src/graphql
        region: ${apiRegion}
        apiId: null
        maxDepth: 2
`;
  fs.writeFileSync(configPath, configData);
};
