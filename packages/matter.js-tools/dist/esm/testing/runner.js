/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import colors from "ansi-colors";
import { glob } from "glob";
import { relative } from "path";
import { Progress } from "../util/progress.js";
import { listSupportFiles } from "./files.js";
import { testNode } from "./node.js";
import { ProgressReporter } from "./reporter.js";
import { testWeb } from "./web.js";
class TestRunner {
  constructor(pkg, progress, options) {
    this.pkg = pkg;
    this.progress = progress;
    this.options = options;
    this.spec = Array();
    this.reporter = new class extends ProgressReporter {
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
    await this.run(this.progress, () => testNode(this, format));
  }
  async runWeb(manual = false) {
    await this.run(this.progress, () => testWeb(this, manual));
  }
  loadFiles(format) {
    const tests = [];
    for (let spec of this.spec) {
      spec = spec.replace(/\.ts$/, ".js");
      spec = relative(this.pkg.path, spec);
      if (!spec.startsWith(".") && !spec.startsWith("build/") && !spec.startsWith("dist/")) {
        spec = `build/${format}/${spec}`;
      }
      spec = this.pkg.resolve(spec);
      spec = spec.replace(/\\/g, "/");
      tests.push(...glob.sync(spec));
    }
    if (!tests.length) {
      fatal(`No files match ${this.spec.join(", ")}`);
    }
    return [...listSupportFiles(format), ...tests];
  }
  async run(progress, runner) {
    await runner();
    if (progress.status !== Progress.Status.Success) {
      fatal(`Test ${progress.status.toLowerCase()}, aborting`);
    }
  }
}
function fatal(message, stack) {
  process.stderr.write(colors.redBright(`

${message}

`));
  if (stack) {
    stack = stack.replace(/^ {4}/gms, "");
    process.stderr.write(`${stack}

`);
  }
  process.exit(1);
}
export {
  TestRunner
};
//# sourceMappingURL=runner.js.map
