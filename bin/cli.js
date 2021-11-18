#!/usr/bin/env node

const { init } = require("../src/init");
const { copyAuthCAC } = require("../src/copyAuthCAC");

const command = process.argv[2];

if (command === "init") {
  console.log("초기화를 시작합니다...");
  init();
  copyAuthCAC();
} else if (command === "copyAuthCAC") {
  copyAuthCAC();
} else if (command === "build") {
  // buildDBComponents();
}

console.log(process.argv[2]);