/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { readFileSync, statSync } from "fs";
import { readdir, stat } from "fs/promises";
import { dirname, relative, resolve } from "path";
import { ignoreError, ignoreErrorSync } from "./errors.js";
import { Progress } from "./progress.js";
function findJson(filename, path = ".", title) {
  path = resolve(path);
  while (true) {
    const json = ignoreErrorSync("ENOENT", () => JSON.parse(readFileSync(resolve(path, filename)).toString()));
    if (json) {
      if (title === void 0 || json.name === title) {
        return { root: path, json };
      }
    }
    const parent = dirname(path);
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
    this.src = !!ignoreErrorSync("ENOENT", () => statSync(this.resolve("src")).isDirectory());
    this.tests = !!ignoreErrorSync("ENOENT", () => statSync(this.resolve("test")).isDirectory());
    this.library = !!(this.json.main || this.json.module || this.json.exports);
  }
  get name() {
    return this.json.name;
  }
  resolve(path) {
    return resolve(this.path, path);
  }
  relative(path) {
    return relative(this.path, path);
  }
  start(what) {
    const progress = new Progress();
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
        const stats = await ignoreError("ENOENT", async () => await stat(p));
        if (!stats) {
          return;
        }
        let thisMtime;
        if (stats.isDirectory()) {
          const paths2 = (await readdir(p)).map((p2) => resolve(p, p2));
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
    pkg = new Package({ path: dirname(pkg.path) });
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
export {
  Package
};
//# sourceMappingURL=package.js.map
