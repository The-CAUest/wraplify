const fs = require("fs");
const path = require("path");

exports.copyAuthCAC = () => {
  // copy authentication class and components

  console.log("=================== Start Copy Auth Class ===================");
  try {
    fs.mkdirSync(path.join(process.cwd(), `src/classes`), { recursive: true });
  } catch (e) {}

  const authClassPath = path.join(__dirname, "../classes/WraplifyAuth.js");
  const authClassTargetPath = path.join(
    process.cwd(),
    "src/classes/WraplifyAuth.js"
  );

  fs.copyFileSync(authClassPath, authClassTargetPath);

  console.log("=================== End Copy Auth Class ===================\n");

  console.log("=================== Start Copy Auth Common ===================");
  try {
    fs.mkdirSync(path.join(process.cwd(), `src/common`), { recursive: true });
  } catch (e) {}

  const authCommonPath = path.join(__dirname, "../common/auth.js");
  const authCommonTargetPath = path.join(process.cwd(), "src/common/auth.js");

  fs.copyFileSync(authCommonPath, authCommonTargetPath);

  console.log("=================== Ent Copy Auth Common ===================\n");

  console.log(
    "=================== Start Copy Auth Components ==================="
  );
  try {
    fs.mkdirSync(path.join(process.cwd(), `src/components`), {
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

  console.log(
    "=================== End Copy Auth Components ===================\n"
  );
};
