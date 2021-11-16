const fs = require("fs");
const path = require("path");

const schema = require("./schema");

const classesPath = path.join(process.cwd(), `./src/classes`);

try {
  fs.mkdirSync(classesPath, { recursive: true });
} catch (e) {}

const dbObjects = Object.keys(schema);

console.log(dbObjects);

dbObjects.forEach((objName) => {
  const classContents = `import { API, graphqlOperation } from "aws-amplify";
import { create${objName}, delete${objName}, update${objName} } from "../graphql/mutations";
import { get${objName}, list${objName}s } from "../graphql/queries";

class ${objName} {
  static create${objName} = async (input) => {
    const { data } = await API.graphql(graphqlOperation(create${objName}, { input }));
    return data?.create${objName};
  };

  static read${objName} = async (id) => {
    const { data } = await API.graphql(graphqlOperation(get${objName}, { id }));
    return data?.get${objName};
  };

  static update${objName} = async (input) => {
    const { data } = await API.graphql(graphqlOperation(update${objName}, { input }));
    return data?.update${objName};
  };

  static delete${objName} = async (id) => {
    const { data } = await API.graphql(
      graphqlOperation(delete${objName}, { input: { id } })
    );
    return data?.delete${objName};
  };

  static list${objName} = async () => {
    const {
      data: {
        list${objName}s: { items },
      },
    } = await API.graphql(graphqlOperation(list${objName}s));
    return items;
  };
}

export default ${objName};`;

  const objPath = path.join(classesPath, `${objName}.js`);
  console.log(objPath);
  fs.writeFileSync(objPath, classContents);
});
