/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { build as esbuild } from "esbuild";
import { cp, mkdir, readFile, rm, stat, symlink, writeFile } from "fs/promises";
import { glob } from "glob";
import { platform } from "os";
import { ignoreError } from "../util/errors.js";
import { Package } from "../util/package.js";
import { Typescript } from "./typescript.js";
class Project {
  constructor(source = ".") {
    if (typeof source === "string") {
      this.pkg = new Package({ path: source });
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
    await ignoreError("ENOENT", async () => {
      if ((await stat(this.pkg.resolve("test"))).isDirectory()) {
        await this.build(format, "test", `build/${format}/test`);
      }
    });
    const src = `dist/${format}`;
    const dest = `build/${format}/src`;
    try {
      await ignoreError("EEXIST", async () => await symlink(this.pkg.resolve(src), this.pkg.resolve(dest)));
    } catch (e) {
      if (e.code === "EPERM" && platform() === "win32") {
        await cp(this.pkg.resolve(src), this.pkg.resolve(dest), {
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
      await rm(this.pkg.resolve(dir), { recursive: true, force: true });
    }
  }
  async buildDeclarations() {
    Typescript.emitDeclarations(this.pkg);
  }
  async validateTypes() {
    Typescript.validateTypes(this.pkg);
  }
  async installDeclarationFormat(format) {
    const srcMaps = Array();
    await cp(this.pkg.resolve("build/types/src"), this.pkg.resolve(`dist/${format}`), {
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
      const map = await readFile(source);
      let pos = map.indexOf('"sources":["../');
      if (pos === -1) {
        throw new Error(
          `Could not find sources position in declaration map ${source}, format may have changed`
        );
      }
      pos += 12;
      map.copyWithin(pos, pos + 3);
      await writeFile(dest, map.subarray(0, map.length - 3));
    }
  }
  async installDeclarations() {
    await mkdir(this.pkg.resolve("dist"), { recursive: true });
    if (this.pkg.esm) {
      await this.installDeclarationFormat("esm");
    }
    if (this.pkg.cjs) {
      await this.installDeclarationFormat("cjs");
    }
  }
  async recordBuildTime() {
    await mkdir(this.pkg.resolve("build"), { recursive: true });
    await writeFile(this.pkg.resolve("build/timestamp"), "");
  }
  async build(format, indir, outdir) {
    const config = await ignoreError(
      "ERR_MODULE_NOT_FOUND",
      () => import(`file://${this.pkg.path}/build.config.js`)
    );
    await config?.before?.(this, format);
    const entryPoints = await this.targets(indir, outdir, "ts", "js");
    for (const entry of entryPoints) {
      entry.out = entry.out.replace(/\.[jt]s$/, "");
    }
    await esbuild({
      entryPoints,
      outdir: this.pkg.path,
      format,
      sourcemap: true,
      absWorkingDir: this.pkg.path
    });
    for (const entry of await this.targets(indir, outdir, "cjs", "mjs", "d.cts", "d.mts")) {
      await cp(entry.in, entry.out);
    }
    await config?.after?.(this, format);
  }
  async specifyFormat(dir, format) {
    if (format === "cjs") {
      await writeFile(this.pkg.resolve(`${dir}/${format}/package.json`), '{ "type": "commonjs" }');
    }
  }
  async targets(indir, outdir, ...extensions) {
    indir = this.pkg.resolve(indir).replace(/\\/g, "/");
    outdir = this.pkg.resolve(outdir).replace(/\\/g, "/");
    return (await glob(extensions.map((ext) => `${indir}/**/*.${ext}`))).map((file) => ({
      in: file,
      out: `${outdir}/${file.slice(indir.length + 1)}`
    }));
  }
}
export {
  Project
};
//# sourceMappingURL=project.js.map
