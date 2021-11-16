const fs = require("fs");
const { Module } = require("module");
const path = require("path");

Module.exports = (filePath) => {
  const fullPath = path.join(__dirname, filePath);

  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) return console.log("삭제할 수 없는 파일입니다");

    fs.unlink(fullPath, (err) =>
      err
        ? console.log(err)
        : console.log(`${filePath} 를 정상적으로 삭제했습니다`)
    );
  });
};
