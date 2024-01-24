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
var progress_exports = {};
__export(progress_exports, {
  Progress: () => Progress
});
module.exports = __toCommonJS(progress_exports);
var import_ansi_colors = __toESM(require("ansi-colors"), 1);
var import_process = require("process");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
const actualWrite = process.stdout.write;
const FRONT = "\x1B[G";
const CLEAR = "\x1B[K";
function packageIdentity(pkg) {
  return `${import_ansi_colors.default.bold(pkg.json.name)}@${pkg.json.version}`;
}
class Progress {
  constructor() {
    this.status = Progress.Status.Startup;
  }
  skip(why, pkg) {
    this.write(import_ansi_colors.default.dim(`Skip ${packageIdentity(pkg)}: ${why}

`));
  }
  startup(what, pkg) {
    this.status = Progress.Status.Startup;
    this.write(`${what} ${packageIdentity(pkg)}
`);
  }
  update(text, extra) {
    this.status = Progress.Status.Ongoing;
    let duration;
    if (this.start === void 0) {
      this.start = (/* @__PURE__ */ new Date()).getTime();
      duration = "";
    } else {
      duration = this.duration;
    }
    extra = extra === void 0 ? "" : ` ${extra}`;
    this.write(`${CLEAR}  ${import_ansi_colors.default.yellow("\u29D7")} ${text} ${duration}${extra}${FRONT}`);
    import_process.stdout.write("\r");
  }
  success(text) {
    this.status = Progress.Status.Success;
    this.write(`${CLEAR}  ${import_ansi_colors.default.green("\u2714")} ${text} ${this.duration}
`);
    delete this.start;
  }
  failure(text) {
    this.status = Progress.Status.Failure;
    this.write(`${CLEAR}  ${import_ansi_colors.default.redBright("\u2717")} ${text} ${this.duration}
`);
    delete this.start;
  }
  info(label, value) {
    if (value) {
      label = `${import_ansi_colors.default.dim(label)} ${value}`;
    }
    this.write(`${CLEAR}  ${import_ansi_colors.default.dim("\u2023")} ${label}
`);
  }
  shutdown() {
    import_process.stdout.write("\n");
  }
  async run(what, fn) {
    this.update(what);
    await fn();
    this.success(what);
  }
  write(text) {
    if (this.lastLine === text) {
      return;
    }
    actualWrite.call(process.stdout, this.lastLine = text);
  }
  get duration() {
    let ms = this.start ? (/* @__PURE__ */ new Date()).getTime() - this.start : 0;
    if (ms < 1e3) {
      ms = Math.round(ms / 10) / 100;
    } else if (ms < 1e4) {
      ms = Math.round(ms / 100) / 10;
    } else {
      ms = Math.trunc(ms / 1e3);
    }
    return import_ansi_colors.default.dim.yellow(`(${ms}s)`);
  }
}
((Progress2) => {
  let Status;
  ((Status2) => {
    Status2["Startup"] = "startup";
    Status2["Ongoing"] = "ongoing";
    Status2["Success"] = "success";
    Status2["Failure"] = "failure";
  })(Status = Progress2.Status || (Progress2.Status = {}));
})(Progress || (Progress = {}));
//# sourceMappingURL=progress.js.map
