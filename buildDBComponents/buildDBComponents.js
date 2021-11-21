const fs = require("fs");
const path = require("path");
const { makeCreateComponent } = require(`./preCreate`);
const { makeReadComponent } = require(`./preRead`);
const { makeUpdateComponent } = require(`./preUpdate`);
const { makeDeleteComponent } = require(`./preDelete`);
const { makeListComponent } = require(`./preList`);

//생성시키는 code: process.cwd() + ./buildDBComponents/buildDBComponents.js
//생성될 폴더: process.cwd() + ./components/crudl

const schemaParser = () => {
  const schemaPath = path.join(process.cwd(), `./src/schema.js`);
  const schema = require(schemaPath);

  const objects = Object.keys(schema); // Stage, Note
  return objects;
};

//writeFile(fileContex, name)

const writeFile = (fileContext, name, functionName) => {
  const filePath = path.join(
    process.cwd(),
    `./src/components/crudl/${name}${functionName}.js`
  );

  fs.writeFileSync(filePath, fileContext, "utf-8");
};

module.exports = () => {
  const filePath = path.join(process.cwd(), `./src/components/crudl`);
  if (filePath) {
    fs.rmdir(filePath, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    });
  }
  try {
    fs.mkdirSync(filePath, { recursive: true });
  } catch (e) {
    console.log("Cannot create folder ", e);
  }

  const objects = schemaParser();
  for (let idx = 0; idx < objects.length; idx++) {
    writeFile(makeCreateComponent(objects[idx]), objects[idx], "Create");
    writeFile(makeReadComponent(objects[idx]), objects[idx], "Read");
    writeFile(makeUpdateComponent(objects[idx]), objects[idx], "Update");
    writeFile(makeDeleteComponent(objects[idx]), objects[idx], "Delete");
    writeFile(makeListComponent(objects[idx]), objects[idx], "List");
  }
};
