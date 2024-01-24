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
var runner_exports = {};
__export(runner_exports, {
  TestRunner: () => TestRunner
});
module.exports = __toCommonJS(runner_exports);
var import_ansi_colors = __toESM(require("ansi-colors"), 1);
var import_glob = require("glob");
var import_path = require("path");
var import_progress = require("../util/progress.js");
var import_files = require("./files.js");
var import_node = require("./node.js");
var import_reporter = require("./reporter.js");
var import_web = require("./web.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
class TestRunner {
  constructor(pkg, progress, options) {
    this.pkg = pkg;
    this.progress = progress;
    this.options = options;
    this.spec = Array();
    this.reporter = new class extends import_reporter.ProgressReporter {
      constructor() {
        super(progress);
      }
      failRun(message, stack) {
        fatal(message, stack);
      }
    }();
    if (options.spec === void 0) {
      this.spec = ["test/**/*Test.ts"];
    } else if (Array.isArray(options.spec)) {
      this.spec = options.spec;
    } else {
      this.spec = [options.spec];
    }
  }
  async runNode(format = "esm") {
    await this.run(this.progress, () => (0, import_node.testNode)(this, format));
  }
  async runWeb(manual = false) {
    await this.run(this.progress, () => (0, import_web.testWeb)(this, manual));
  }
  loadFiles(format) {
    const tests = [];
    for (let spec of this.spec) {
      spec = spec.replace(/\.ts$/, ".js");
      spec = (0, import_path.relative)(this.pkg.path, spec);
      if (!spec.startsWith(".") && !spec.startsWith("build/") && !spec.startsWith("dist/")) {
        spec = `build/${format}/${spec}`;
      }
      spec = this.pkg.resolve(spec);
      spec = spec.replace(/\\/g, "/");
      tests.push(...import_glob.glob.sync(spec));
    }
    if (!tests.length) {
      fatal(`No files match ${this.spec.join(", ")}`);
    }
    return [...(0, import_files.listSupportFiles)(format), ...tests];
  }
  async run(progress, runner) {
    await runner();
    if (progress.status !== import_progress.Progress.Status.Success) {
      fatal(`Test ${progress.status.toLowerCase()}, aborting`);
    }
  }
}
function fatal(message, stack) {
  process.stderr.write(import_ansi_colors.default.redBright(`

${message}

`));
  if (stack) {
    stack = stack.replace(/^ {4}/gms, "");
    process.stderr.write(`${stack}

`);
  }
  process.exit(1);
}
//# sourceMappingURL=runner.js.map
