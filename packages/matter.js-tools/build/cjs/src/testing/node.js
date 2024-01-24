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
var node_exports = {};
__export(node_exports, {
  testNode: () => testNode
});
module.exports = __toCommonJS(node_exports);
var import_promises = require("fs/promises");
var import_mocha = __toESM(require("mocha"), 1);
var import_path = require("path");
var import_mocha2 = require("./mocha.js");
var import_options = require("./options.js");
var import_global_definitions = require("./global-definitions.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
async function testNode(runner, format) {
  (0, import_mocha2.generalSetup)(import_mocha.default);
  const mocha = new import_mocha.default({
    inlineDiffs: true,
    reporter: (0, import_mocha2.adaptReporter)(import_mocha.default, format.toUpperCase(), runner.reporter)
  });
  import_options.TestOptions.apply(mocha, runner.options);
  const files = runner.loadFiles(format);
  files.forEach((path) => {
    path = (0, import_path.relative)(process.cwd(), path);
    if (path[0] !== ".") {
      path = `./${path}`;
    }
    mocha.addFile(path);
  });
  await mocha.loadFilesAsync();
  const profiler = new Profiler();
  if (runner.options.profile) {
    await profiler.start();
  }
  await new Promise((resolve) => {
    const runner2 = mocha.run(() => resolve(runner2));
  });
  if (runner.options.profile) {
    await profiler.stop(runner.pkg.resolve("build/profiles"));
  }
}
class Profiler {
  #profiler;
  async start() {
    this.#profiler = await import("v8-profiler-next");
    this.#profiler.setGenerateType(1);
    this.#profiler.startProfiling();
  }
  async stop(outputDir) {
    if (!this.#profiler) {
      return;
    }
    const profile = this.#profiler.stopProfiling();
    const result = await new Promise(
      (accept, reject) => profile.export((error, result2) => {
        if (error) {
          reject(error);
        } else if (!result2) {
          reject(new Error("No profile error or result"));
        } else {
          accept(result2);
        }
      })
    );
    await (0, import_promises.mkdir)(outputDir, { recursive: true });
    await (0, import_promises.writeFile)(`${outputDir}/test-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 19)}.cpuprofile`, result);
    this.#profiler = void 0;
  }
}
//# sourceMappingURL=node.js.map
