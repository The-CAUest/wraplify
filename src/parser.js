const fs = require("fs");
const path = require("path");
const { getProjectInfo } = require("./loader");

// import * from './amplify/backend/api/test1/schema.graphql'

const schemaParser = (tokens) => {
  let output = {};
  let idx = 0;
  let tableName;
  while (idx < tokens.length) {
    if (tokens[idx].startsWith("type")) {
      //tablename
      tableName = tokens[idx].split(" ");
      output[tableName[1]] = [];
    } else if (tokens[idx].startsWith("  ")) {
      let tableData = {};
      //data
      let dataToken = tokens[idx].split(" ");
      dataToken = removeSpace(dataToken);
      tableData.name = dataToken[0].slice(0, -1);
      tableData.mandatory = false;
      if (dataToken[1].endsWith("!")) {
        //꼭 있어야하는 필수 data
        tableData.mandatory = true;
        dataToken[1] = dataToken[1].slice(0, -1);
      }
      tableData.type = dataToken[1];
      output[tableName[1]].push(tableData);
    }
    idx++;
  }
  return output;
};

const removeSpace = (arr) => {
  for (let idx = 0; idx < arr.length; idx++) {
    if (arr[idx] === "") {
      arr.splice(idx, 1);
      idx--;
    }
  }
  return arr;
};

module.exports = () => {
  const projectInfo = getProjectInfo();

  const filePath = path.join(
    process.cwd(),
    `./amplify/backend/api/${projectInfo.projectName}Api/schema.graphql`
  );

  let tokens = removeSpace(fs.readFileSync(filePath, "utf-8").split(/\n|\r/));
  // console.log(tokens)
  tokens = schemaParser(tokens);
  const schemaPath = path.join(process.cwd(), `./src/schema.js`);
  fs.writeFileSync(
    schemaPath,
    "module.exports = " + JSON.stringify(tokens),
    "utf-8"
  );
};
