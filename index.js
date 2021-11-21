const parser = require("./src/parser");
const buildDBComponents = require("./buildDBComponents/buildDBComponents");

// (async () => {
//   await parser();
// })().then(buildDBComponents());
parser();
buildDBComponents();
