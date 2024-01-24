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
var package_exports = {};
__export(package_exports, {
  Package: () => Package
});
module.exports = __toCommonJS(package_exports);
var import_fs = require("fs");
var import_promises = require("fs/promises");
var import_path = require("path");
var import_errors = require("./errors.js");
var import_progress = require("./progress.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
function findJson(filename, path = ".", title) {
  path = (0, import_path.resolve)(path);
  while (true) {
    const json = (0, import_errors.ignoreErrorSync)("ENOENT", () => JSON.parse((0, import_fs.readFileSync)((0, import_path.resolve)(path, filename)).toString()));
    if (json) {
      if (title === void 0 || json.name === title) {
        return { root: path, json };
      }
    }
    const parent = (0, import_path.dirname)(path);
    if (parent === path) {
      throw new Error(`Could not locate ${title ?? filename}`);
    }
    path = parent;
  }
}
class Package {
  constructor({
    path = ".",
    name
  } = {}) {
    const { root, json } = findJson("package.json", path, name);
    this.path = root;
    this.json = json;
    const { esm, cjs } = selectFormats(this.json);
    this.esm = esm;
    this.cjs = cjs;
    this.src = !!(0, import_errors.ignoreErrorSync)("ENOENT", () => (0, import_fs.statSync)(this.resolve("src")).isDirectory());
    this.tests = !!(0, import_errors.ignoreErrorSync)("ENOENT", () => (0, import_fs.statSync)(this.resolve("test")).isDirectory());
    this.library = !!(this.json.main || this.json.module || this.json.exports);
  }
  get name() {
    return this.json.name;
  }
  resolve(path) {
    return (0, import_path.resolve)(this.path, path);
  }
  relative(path) {
    return (0, import_path.relative)(this.path, path);
  }
  start(what) {
    const progress = new import_progress.Progress();
    progress.startup(what, this);
    return progress;
  }
  async lastModified(...paths) {
    return this.lastModifiedAbsolute(paths.map((p) => this.resolve(p)));
  }
  async lastModifiedAbsolute(paths) {
    let mtime = 0;
    await Promise.all(
      paths.map(async (p) => {
        const stats = await (0, import_errors.ignoreError)("ENOENT", async () => await (0, import_promises.stat)(p));
        if (!stats) {
          return;
        }
        let thisMtime;
        if (stats.isDirectory()) {
          const paths2 = (await (0, import_promises.readdir)(p)).map((p2) => (0, import_path.resolve)(p, p2));
          thisMtime = await this.lastModifiedAbsolute(paths2);
        } else {
          thisMtime = stats.mtimeMs;
        }
        if (thisMtime > mtime) {
          mtime = thisMtime;
        }
      })
    );
    return mtime;
  }
  get dependencies() {
    let result = Array();
    for (const type of ["dependencies", "devDependencies", "peerDependencies"]) {
      if (typeof this.json[type] === "object") {
        result = [...result, ...Object.keys(this.json[type])];
      }
    }
    return [...new Set(result)];
  }
  static set workingDir(wd) {
    workingDir = wd;
  }
  static node(name) {
    return new Package({
      path: this.workspace.resolve(`node_modules/${name}`)
    });
  }
  static get workspace() {
    if (!workspace) {
      workspace = find(workingDir, (pkg) => Array.isArray(pkg.json.workspaces));
    }
    return workspace;
  }
  static get tools() {
    if (!tools) {
      tools = new Package({ path: this.workspace.resolve("packages/matter.js-tools") });
    }
    return tools;
  }
}
let workingDir = ".";
let workspace;
let tools;
function find(startDir, selector) {
  let pkg = new Package({ path: startDir });
  while (!selector(pkg)) {
    pkg = new Package({ path: (0, import_path.dirname)(pkg.path) });
  }
  return pkg;
}
function selectFormats(json) {
  let esm, cjs;
  if (json.type === "module") {
    esm = true;
    cjs = json.main !== void 0 && json.module !== void 0 || !!Object.values(json.exports ?? {}).find((exp) => exp.require);
  } else {
    cjs = true;
    esm = !!json.module || !!Object.values(json.exports ?? {}).find((exp) => exp.import);
  }
  return { esm, cjs };
}
//# sourceMappingURL=package.js.map
