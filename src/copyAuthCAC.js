const fs = require("fs");

exports.copyAuthCAC = () => {
  // copy authentication class and components
  const stdinCommand = process.platform === "win32" ? "type" : "cat";

  console.log("=================== Start Copy Auth Class ===================");

  const authClassPath = path.join(__dirname, "../classes/WraplifyAuth.js");
  const authClassTargetPath = path.join(
    process.cwd(),
    "src/classes/WraplifyAuth.js"
  );

  fs.copyFileSync(
    authClassPath,
    authClassTargetPath,
    fs.constants.COPYFILE_FICLONE_FORCE
  );

  console.log("=================== End Copy Auth Class ===================\n");

  console.log("=================== Start Copy Auth Common ===================");

  const authCommonPath = path.join(__dirname, "../common/auth.js");
  const authCommonTargetPath = path.join(process.cwd(), "src/common/auth.js");

  fs.copyFileSync(
    authCommonPath,
    authCommonTargetPath,
    fs.constants.COPYFILE_FICLONE_FORCE
  );

  console.log("=================== Ent Copy Auth Common ===================\n");

  console.log(
    "=================== Start Copy Auth Components ==================="
  );

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

    fs.copyFileSync(
      componentPath,
      componentTargetPath,
      fs.constants.COPYFILE_FICLONE_FORCE
    );
  });

  console.log(
    "=================== End Copy Auth Components ===================\n"
  );
};
