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
var reporter_exports = {};
__export(reporter_exports, {
  ConsoleProxyReporter: () => ConsoleProxyReporter,
  ProgressReporter: () => ProgressReporter
});
module.exports = __toCommonJS(reporter_exports);
var import_ansi_colors = __toESM(require("ansi-colors"), 1);
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
class ProgressReporter {
  constructor(progress) {
    this.progress = progress;
    this.run = "";
    this.suite = Array();
    this.failures = Array();
  }
  beginRun(name) {
    this.run = name;
  }
  beginSuite(name) {
    this.suite = name;
  }
  beginTest(_name, stats) {
    const title = this.suite[0];
    if (this.lastTitle !== title) {
      this.lastTitle = title;
      this.progress.update(this.summarize(stats), title);
    }
  }
  failTest(name, detail) {
    this.failures.push({
      suite: this.suite,
      test: name,
      detail
    });
  }
  endRun(stats) {
    if (this.failures.length) {
      this.progress.failure(this.summarize(stats));
      this.dumpFailures();
    } else if (!stats.complete) {
      this.progress.failure("No tests found");
    } else {
      this.progress.success(this.summarize(stats));
    }
  }
  summarize(stats) {
    const complete = import_ansi_colors.default.dim(`${stats.complete}/${stats.total}`);
    const failures = stats.failures ? import_ansi_colors.default.redBright(` ${stats.failures.toString()} failed`) : "";
    return `${import_ansi_colors.default.bold(this.run)} ${complete}${failures}`;
  }
  dumpFailures() {
    for (let i = 0; i < this.failures.length; i++) {
      const failure = this.failures[i];
      const index = import_ansi_colors.default.redBright(`Failure ${import_ansi_colors.default.bold((i + 1).toString())} of ${this.failures.length}`);
      process.stdout.write(`
${index} ${failure.suite.join(" \u27A1 ")} \u27A1 ${import_ansi_colors.default.bold(failure.test)}

`);
      process.stdout.write(`  ${failure.detail.message}

`);
      if (failure.detail.diff) {
        process.stdout.write(`      ${failure.detail.diff.replace(/\n/gm, "\n      ")}

`);
      }
      if (failure.detail.stack) {
        process.stdout.write(`  ${import_ansi_colors.default.dim(failure.detail.stack.replace(/\n/gm, "\n  "))}

`);
      }
      if (failure.detail.logs) {
        process.stdout.write(`  ${failure.detail.logs.replace(/\n/gm, "\n  ")}

`);
      }
    }
  }
}
const actualConsole = console;
const actualLog = actualConsole.log;
function proxy(...args) {
  actualLog.call(actualConsole, `${ConsoleProxyReporter.FLAG}${JSON.stringify(args)}`);
}
class ConsoleProxyReporter {
  static {
    this.FLAG = "<<REPORT>> ";
  }
  beginRun(name, stats) {
    proxy("beginRun", name, stats);
  }
  beginSuite(name, stats) {
    proxy("beginSuite", name, stats);
  }
  beginTest(name, stats) {
    proxy("beginTest", name, stats);
  }
  endRun(stats) {
    proxy("endRun", stats);
  }
  failTest(name, detail) {
    proxy("failTest", name, detail);
  }
  failRun(message, stack) {
    proxy("failRun", message, stack);
  }
}
//# sourceMappingURL=reporter.js.map
