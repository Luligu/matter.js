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
var builder_exports = {};
__export(builder_exports, {
  Builder: () => Builder,
  Target: () => Target
});
module.exports = __toCommonJS(builder_exports);
var import_ansi_colors = __toESM(require("ansi-colors"), 1);
var import_error = require("./error.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
var Target = /* @__PURE__ */ ((Target2) => {
  Target2["clean"] = "clean";
  Target2["types"] = "types";
  Target2["esm"] = "esm";
  Target2["cjs"] = "cjs";
  return Target2;
})(Target || {});
class Builder {
  constructor(options) {
    this.options = options;
    this.unconditional = options.clean || options.targets?.indexOf("clean" /* clean */) !== -1;
  }
  async build(project) {
    const progress = project.pkg.start("Building");
    try {
      await this.doBuild(project, progress);
    } catch (e) {
      progress.failure(`Unexpected build error`);
      progress.shutdown();
      process.stderr.write(`${e.stack ?? e.message}

`);
      process.exit(1);
    }
    progress.shutdown();
  }
  async doBuild(project, progress) {
    const targets = this.selectTargets(project);
    if (targets.has("clean" /* clean */) || this.options.clean) {
      await progress.run("Clean", () => project.clean());
    }
    if (targets.has("types" /* types */)) {
      try {
        if (project.pkg.library) {
          await progress.run(
            `Generate ${import_ansi_colors.default.bold("type declarations")}`,
            () => project.buildDeclarations()
          );
          await progress.run(
            `Install ${import_ansi_colors.default.bold("type declarations")}`,
            () => project.installDeclarations()
          );
        } else {
          await progress.run(`Validating ${import_ansi_colors.default.bold("types")}`, () => project.validateTypes());
        }
      } catch (e) {
        if (e instanceof import_error.BuildError) {
          progress.failure("Terminating due to type errors");
          process.stderr.write(e.diagnostics);
          process.exit(1);
        }
        throw e;
      }
    }
    if (targets.has("esm" /* esm */)) {
      await this.transpile(project, progress, "esm" /* esm */);
    }
    if (targets.has("cjs" /* cjs */)) {
      await this.transpile(project, progress, "cjs" /* cjs */);
    }
    if (!this.options.targets?.length) {
      await project.recordBuildTime();
    }
  }
  async transpile(project, progress, format) {
    const fmt = format.toUpperCase();
    await progress.run(
      `Transpile ${import_ansi_colors.default.bold("library")} to ${import_ansi_colors.default.bold(fmt)}`,
      () => project.buildSource(format)
    );
    if (project.pkg.tests) {
      await progress.run(
        `Transpile ${import_ansi_colors.default.bold("tests")} to ${import_ansi_colors.default.bold(fmt)}`,
        () => project.buildTests(format)
      );
    }
  }
  selectTargets(project) {
    const targets = new Set(this.options.targets);
    if (!targets.size) {
      targets.add("types" /* types */);
      if (project.pkg.esm) {
        targets.add("esm" /* esm */);
      }
      if (project.pkg.cjs) {
        targets.add("cjs" /* cjs */);
      }
    } else {
      if (!project.pkg.esm) {
        targets.delete("esm" /* esm */);
      }
      if (!project.pkg.cjs) {
        targets.delete("cjs" /* cjs */);
      }
    }
    return targets;
  }
}
//# sourceMappingURL=builder.js.map
