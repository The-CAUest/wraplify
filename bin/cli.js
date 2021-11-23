#!/usr/bin/env node

const init = require("../src/init");
const copyAuthCAC = require("../src/copyAuthCAC");
const parser = require("../src/parser");
const buildDBComponents = require("../buildDBComponents/buildDBComponents");
const openAdminUI = require("../src/openAdminUI");
const pullAndCodegen = require("../src/pullAndCodegen");
const writeObjClasses = require("../src/objClassWriter");
const disableConflict = require("../src/disableConflict");

const command = process.argv[2];

(async () => {
  if (command === "init") {
    init();
    copyAuthCAC();
    await openAdminUI();
    pullAndCodegen();
    disableConflict();
    parser();
    writeObjClasses();
    buildDBComponents();
  } else if (command === "copyAuthCAC") {
    copyAuthCAC();
  } else if (command === "build") {
    parser();
    writeObjClasses();
    buildDBComponents();
  } else if (command === "pull") {
    pullAndCodegen();
  } else if (command === "editmodel") {
    await openAdminUI();
  } else if (command === "rebuild") {
    pullAndCodegen();
    disableConflict();
    parser();
    writeObjClasses();
    buildDBComponents();
  }
})();
