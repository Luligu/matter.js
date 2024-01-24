/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import colors from "ansi-colors";
import { BuildError } from "./error.js";
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
            `Generate ${colors.bold("type declarations")}`,
            () => project.buildDeclarations()
          );
          await progress.run(
            `Install ${colors.bold("type declarations")}`,
            () => project.installDeclarations()
          );
        } else {
          await progress.run(`Validating ${colors.bold("types")}`, () => project.validateTypes());
        }
      } catch (e) {
        if (e instanceof BuildError) {
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
      `Transpile ${colors.bold("library")} to ${colors.bold(fmt)}`,
      () => project.buildSource(format)
    );
    if (project.pkg.tests) {
      await progress.run(
        `Transpile ${colors.bold("tests")} to ${colors.bold(fmt)}`,
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
export {
  Builder,
  Target
};
//# sourceMappingURL=builder.js.map
