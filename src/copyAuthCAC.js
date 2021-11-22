const fs = require("fs");
const path = require("path");

module.exports = () => {
  // copy authentication class and components

  console.log("=================== Copy Auth Class ===================");
  try {
    fs.rmdirSync(path.join(process.cwd(), `src/classes/auth`));
    fs.mkdirSync(path.join(process.cwd(), `src/classes/auth`), {
      recursive: true,
    });
  } catch (e) {}

  const authClassPath = path.join(__dirname, "../classes/auth/WraplifyAuth.js");
  const authClassTargetPath = path.join(
    process.cwd(),
    "src/classes/WraplifyAuth.js"
  );

  fs.copyFileSync(authClassPath, authClassTargetPath);

  console.log("=================== Copy Auth Common ===================");
  try {
    fs.mkdirSync(path.join(process.cwd(), `src/common`), { recursive: true });
  } catch (e) {}

  const authCommonPath = path.join(__dirname, "../common/auth.js");
  const authCommonTargetPath = path.join(process.cwd(), "src/common/auth.js");

  fs.copyFileSync(authCommonPath, authCommonTargetPath);

  console.log("=================== Copy Auth Components ===================");
  try {
    fs.mkdirSync(path.join(process.cwd(), `src/components/auth`), {
      recursive: true,
    });
  } catch (e) {}

  const componentFiles = [
    "ConfirmSignUpForm.js",
    "ForgotPasswordForm.js",
    "LoginForm.js",
    "SignUpForm.js",
    "WraplifyAuthenticator.js",
  ];

  componentFiles.forEach((fileName) => {
    const componentPath = path.join(
      __dirname,
      `../components/auth/${fileName}`
    );
    const componentTargetPath = path.join(
      process.cwd(),
      `src/components/auth/${fileName}`
    );

    fs.copyFileSync(componentPath, componentTargetPath);
  });
};
