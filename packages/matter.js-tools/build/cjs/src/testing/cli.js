"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var cli_exports = {};
__export(cli_exports, {
  main: () => main
});
module.exports = __toCommonJS(cli_exports);
var import_yargs = __toESM(require("yargs"), 1);
var import_helpers = require("yargs/helpers");
var import_project = require("../building/project.js");
var import_runner = require("./runner.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
var TestType = /* @__PURE__ */ ((TestType2) => {
  TestType2["esm"] = "esm";
  TestType2["cjs"] = "cjs";
  TestType2["web"] = "web";
  return TestType2;
})(TestType || {});
async function main(argv = process.argv) {
  const testTypes = /* @__PURE__ */ new Set();
  let manual = false;
  const args = await (0, import_yargs.default)((0, import_helpers.hideBin)(argv)).usage("Runs tests in packages adhering to matter.js standards.").option("prefix", {
    alias: "p",
    default: ".",
    type: "string",
    describe: "specify directory of package to test"
  }).option("web", {
    alias: "w",
    default: false,
    type: "boolean",
    describe: "enable web tests in default test mode"
  }).option("spec", {
    type: "array",
    string: true,
    describe: "One or more paths of tests to run",
    default: "test/**/*Test.ts"
  }).option("fgrep", { alias: "f", type: "string", describe: "Only run tests matching this string" }).option("grep", { alias: "g", type: "string", describe: "Only run tests matching this regexp" }).option("invert", { alias: "i", type: "boolean", describe: "Inverts --grep and --fgrep matches" }).option("profile", { type: "boolean", describe: "Write profiling data to build/profiles (node only)" }).option("all-logs", { type: "boolean", describe: "Emit log messages in real time" }).option("force-exit", { type: "boolean", describe: "Force Node to exit after tests complete" }).command("*", "run all supported test types").command("esm", "run tests on node (ES6 modules)", () => testTypes.add("esm" /* esm */)).command("cjs", "run tests on node (CommonJS modules)", () => testTypes.add("cjs" /* cjs */)).command("web", "run tests in web browser", () => testTypes.add("web" /* web */)).command("manual", "start test server and print URL for manual testing", () => {
    testTypes.add("web" /* web */);
    manual = true;
  }).strict().argv;
  const project = new import_project.Project(args.prefix);
  if (!testTypes.size) {
    if (project.pkg.esm) {
      testTypes.add("esm" /* esm */);
    }
    if (project.pkg.cjs) {
      testTypes.add("cjs" /* cjs */);
    }
    if (args.web) {
      testTypes.add("web" /* web */);
    }
  }
  let esmBuilt = false;
  async function buildEsm() {
    if (esmBuilt) {
      return;
    }
    await project.buildSource("esm");
    await project.buildTests("esm");
    esmBuilt = true;
  }
  const progress = project.pkg.start("Testing");
  const runner = new import_runner.TestRunner(project.pkg, progress, args);
  if (testTypes.has("esm" /* esm */)) {
    await buildEsm();
    await runner.runNode("esm");
  }
  if (testTypes.has("cjs" /* cjs */)) {
    await project.buildSource("cjs");
    await project.buildTests("cjs");
    await runner.runNode("cjs");
  }
  if (testTypes.has("web" /* web */)) {
    await buildEsm();
    await runner.runWeb(manual);
  }
  progress.shutdown();
  if (args.forceExit) {
    process.exit(0);
  }
}
//# sourceMappingURL=cli.js.map
