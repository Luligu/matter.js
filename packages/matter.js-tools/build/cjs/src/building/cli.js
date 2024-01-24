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
var import_builder = require("./builder.js");
var import_graph = require("./graph.js");
var import_project = require("./project.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
var Mode = /* @__PURE__ */ ((Mode2) => {
  Mode2[Mode2["BuildProject"] = 0] = "BuildProject";
  Mode2[Mode2["BuildWorkspace"] = 1] = "BuildWorkspace";
  Mode2[Mode2["DisplayGraph"] = 2] = "DisplayGraph";
  return Mode2;
})(Mode || {});
async function main(argv = process.argv) {
  const targets = Array();
  let mode = 0 /* BuildProject */;
  const args = await (0, import_yargs.default)((0, import_helpers.hideBin)(argv)).usage("Builds packages adhering to matter.js standards.").option("prefix", { alias: "p", default: ".", type: "string", describe: "specify build directory" }).option("clean", { alias: "c", default: false, type: "boolean", describe: "clean before build" }).option("workspaces", { alias: "w", default: false, type: "boolean", describe: "build all workspace packages" }).command("*", "build types and both JS files", () => {
  }).command("clean", "remove build and dist directories", () => targets.push(import_builder.Target.clean)).command("types", "build type definitions", () => targets.push(import_builder.Target.types)).command("esm", "build JS (ES6 modules)", () => targets.push(import_builder.Target.esm)).command("cjs", "build JS (CommonJS modules)", () => targets.push(import_builder.Target.cjs)).command("graph", "display the workspace graph", () => mode = 2 /* DisplayGraph */).wrap(Math.min(process.stdout.columns, 80)).strict().argv;
  if (mode === 0 /* BuildProject */ && args.workspaces) {
    mode = 1 /* BuildWorkspace */;
  }
  function builder() {
    return new import_builder.Builder({ ...args, targets: [...targets] });
  }
  switch (mode) {
    case 0 /* BuildProject */:
      const project = new import_project.Project(args.prefix);
      await builder().build(project);
      break;
    case 1 /* BuildWorkspace */:
      await (await import_graph.Graph.load()).build(builder());
      break;
    case 2 /* DisplayGraph */:
      (await import_graph.Graph.load()).display();
      break;
  }
}
//# sourceMappingURL=cli.js.map
