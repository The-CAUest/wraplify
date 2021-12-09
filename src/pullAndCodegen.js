const shell = require("shelljs");

module.exports = () => {
  console.log("=================== Start Pull ===================");
  shell.exec(`amplify pull --yes`);
  console.log("=================== End Pull ===================\n");

  console.log("=================== Start Codegen ===================");
  shell.exec(`amplify codegen`);
  console.log("=================== End Codegen ===================\n");
};
