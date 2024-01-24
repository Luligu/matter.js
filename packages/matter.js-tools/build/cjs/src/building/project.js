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
var project_exports = {};
__export(project_exports, {
  Project: () => Project
});
module.exports = __toCommonJS(project_exports);
var import_esbuild = require("esbuild");
var import_promises = require("fs/promises");
var import_glob = require("glob");
var import_os = require("os");
var import_errors = require("../util/errors.js");
var import_package = require("../util/package.js");
var import_typescript = require("./typescript.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
class Project {
  constructor(source = ".") {
    if (typeof source === "string") {
      this.pkg = new import_package.Package({ path: source });
    } else {
      this.pkg = source;
    }
    if (!this.pkg.src) {
      throw new Error(`Found package ${this.pkg.json.name} but no src directory is present`);
    }
  }
  async buildSource(format) {
    await this.build(format, "src", `dist/${format}`);
    await this.specifyFormat("dist", format);
  }
  async buildTests(format) {
    await (0, import_errors.ignoreError)("ENOENT", async () => {
      if ((await (0, import_promises.stat)(this.pkg.resolve("test"))).isDirectory()) {
        await this.build(format, "test", `build/${format}/test`);
      }
    });
    const src = `dist/${format}`;
    const dest = `build/${format}/src`;
    try {
      await (0, import_errors.ignoreError)("EEXIST", async () => await (0, import_promises.symlink)(this.pkg.resolve(src), this.pkg.resolve(dest)));
    } catch (e) {
      if (e.code === "EPERM" && (0, import_os.platform)() === "win32") {
        await (0, import_promises.cp)(this.pkg.resolve(src), this.pkg.resolve(dest), {
          recursive: true,
          force: true
        });
      } else {
        throw e;
      }
    }
    await this.specifyFormat("build", format);
  }
  async clean() {
    for (const dir of ["build", "dist"]) {
      await (0, import_promises.rm)(this.pkg.resolve(dir), { recursive: true, force: true });
    }
  }
  async buildDeclarations() {
    import_typescript.Typescript.emitDeclarations(this.pkg);
  }
  async validateTypes() {
    import_typescript.Typescript.validateTypes(this.pkg);
  }
  async installDeclarationFormat(format) {
    const srcMaps = Array();
    await (0, import_promises.cp)(this.pkg.resolve("build/types/src"), this.pkg.resolve(`dist/${format}`), {
      recursive: true,
      force: true,
      filter: (source, dest) => {
        if (source.endsWith(".d.ts.map")) {
          srcMaps.push([source, dest]);
          return false;
        }
        return true;
      }
    });
    for (const [source, dest] of srcMaps) {
      const map = await (0, import_promises.readFile)(source);
      let pos = map.indexOf('"sources":["../');
      if (pos === -1) {
        throw new Error(
          `Could not find sources position in declaration map ${source}, format may have changed`
        );
      }
      pos += 12;
      map.copyWithin(pos, pos + 3);
      await (0, import_promises.writeFile)(dest, map.subarray(0, map.length - 3));
    }
  }
  async installDeclarations() {
    await (0, import_promises.mkdir)(this.pkg.resolve("dist"), { recursive: true });
    if (this.pkg.esm) {
      await this.installDeclarationFormat("esm");
    }
    if (this.pkg.cjs) {
      await this.installDeclarationFormat("cjs");
    }
  }
  async recordBuildTime() {
    await (0, import_promises.mkdir)(this.pkg.resolve("build"), { recursive: true });
    await (0, import_promises.writeFile)(this.pkg.resolve("build/timestamp"), "");
  }
  async build(format, indir, outdir) {
    const config = await (0, import_errors.ignoreError)(
      "ERR_MODULE_NOT_FOUND",
      () => import(`file://${this.pkg.path}/build.config.js`)
    );
    await config?.before?.(this, format);
    const entryPoints = await this.targets(indir, outdir, "ts", "js");
    for (const entry of entryPoints) {
      entry.out = entry.out.replace(/\.[jt]s$/, "");
    }
    await (0, import_esbuild.build)({
      entryPoints,
      outdir: this.pkg.path,
      format,
      sourcemap: true,
      absWorkingDir: this.pkg.path
    });
    for (const entry of await this.targets(indir, outdir, "cjs", "mjs", "d.cts", "d.mts")) {
      await (0, import_promises.cp)(entry.in, entry.out);
    }
    await config?.after?.(this, format);
  }
  async specifyFormat(dir, format) {
    if (format === "cjs") {
      await (0, import_promises.writeFile)(this.pkg.resolve(`${dir}/${format}/package.json`), '{ "type": "commonjs" }');
    }
  }
  async targets(indir, outdir, ...extensions) {
    indir = this.pkg.resolve(indir).replace(/\\/g, "/");
    outdir = this.pkg.resolve(outdir).replace(/\\/g, "/");
    return (await (0, import_glob.glob)(extensions.map((ext) => `${indir}/**/*.${ext}`))).map((file) => ({
      in: file,
      out: `${outdir}/${file.slice(indir.length + 1)}`
    }));
  }
}
//# sourceMappingURL=project.js.map
