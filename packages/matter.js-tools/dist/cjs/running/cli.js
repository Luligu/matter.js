"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var cli_exports = {};
__export(cli_exports, {
  main: () => main
});
module.exports = __toCommonJS(cli_exports);
var import_path = require("path");
var import_process = require("process");
var import_project = require("../building/project.js");
var import_execute = require("./execute.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
async function main(argv = process.argv) {
  let script = argv[2];
  argv = argv.slice(3);
  if (script === void 0 || script === "") {
    console.log("Error: Script name required");
    (0, import_process.exit)(1);
  }
  script = (0, import_path.resolve)(script);
  let dir;
  if (script.match(/[\\/]node_modules[\\/].bin[\\/]/)) {
    dir = process.cwd();
  } else {
    dir = (0, import_path.dirname)(script);
  }
  const project = new import_project.Project(dir);
  let format;
  if (project.pkg.esm) {
    format = "esm";
  } else if (project.pkg.cjs) {
    format = "cjs";
  } else {
    console.error("Error: Could not identify project format");
    (0, import_process.exit)(2);
  }
  await project.buildSource(format);
  script = project.pkg.resolve(
    project.pkg.relative(script).replace(/\.ts$/, ".js").replace(/^src[\\/]/, `dist/${format}/`)
  );
  await (0, import_execute.executeNode)(script, argv);
}
//# sourceMappingURL=cli.js.map
