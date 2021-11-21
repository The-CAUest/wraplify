#!/usr/bin/env node

const init = require("../src/init");
const copyAuthCAC = require("../src/copyAuthCAC");
const parser = require("../src/parser");
const buildDBComponents = require("../buildDBComponents/buildDBComponents");
const openAdminUI = require("../src/openAdminUI");
const pullAndCodegen = require("../src/pullAndCodegen");

const command = process.argv[2];

if (command === "init") {
  console.log("초기화를 시작합니다...");
  init();
  copyAuthCAC();
  openAdminUI();
  pullAndCodegen();
  parser();
  buildDBComponents();
} else if (command === "copyAuthCAC") {
  copyAuthCAC();
} else if (command === "build") {
  parser();
  buildDBComponents();
} else if (command === "pull") {
  pullAndCodegen();
} else if (command === "editmodel") {
  openAdminUI();
}

console.log(process.argv[2]);
