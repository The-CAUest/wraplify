#!/usr/bin/env node

const init = require("../src/init");

const command = process.argv[2];

if (command === "init") {
  console.log("초기화를 시작합니다......");
  init();
}

console.log(process.argv[2]);
