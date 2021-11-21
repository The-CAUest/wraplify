#!/usr/bin/env node

const { init } = require("../src/init");
const { copyAuthCAC } = require("../src/copyAuthCAC");
const { openAdminUI } = require("../src/openAdminUI");

const command = process.argv[2];

if (command === "init") {
  console.log("초기화를 시작합니다...");
  init();
  copyAuthCAC();
  openAdminUI();
} else if (command === "copyAuthCAC") {
  copyAuthCAC();
} else if (command === "build") {
  // buildDBComponents();
} else if (command === "editmodel") {
  openAdminUI();
}

console.log(process.argv[2]);
