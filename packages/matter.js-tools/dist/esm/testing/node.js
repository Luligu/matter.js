/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { mkdir, writeFile } from "fs/promises";
import Mocha from "mocha";
import { relative } from "path";
import { adaptReporter, generalSetup } from "./mocha.js";
import { TestOptions } from "./options.js";
import "./global-definitions.js";
async function testNode(runner, format) {
  generalSetup(Mocha);
  const mocha = new Mocha({
    inlineDiffs: true,
    reporter: adaptReporter(Mocha, format.toUpperCase(), runner.reporter)
  });
  TestOptions.apply(mocha, runner.options);
  const files = runner.loadFiles(format);
  files.forEach((path) => {
    path = relative(process.cwd(), path);
    if (path[0] !== ".") {
      path = `./${path}`;
    }
    mocha.addFile(path);
  });
  await mocha.loadFilesAsync();
  const profiler = new Profiler();
  if (runner.options.profile) {
    await profiler.start();
  }
  await new Promise((resolve) => {
    const runner2 = mocha.run(() => resolve(runner2));
  });
  if (runner.options.profile) {
    await profiler.stop(runner.pkg.resolve("build/profiles"));
  }
}
class Profiler {
  #profiler;
  async start() {
    this.#profiler = await import("v8-profiler-next");
    this.#profiler.setGenerateType(1);
    this.#profiler.startProfiling();
  }
  async stop(outputDir) {
    if (!this.#profiler) {
      return;
    }
    const profile = this.#profiler.stopProfiling();
    const result = await new Promise(
      (accept, reject) => profile.export((error, result2) => {
        if (error) {
          reject(error);
        } else if (!result2) {
          reject(new Error("No profile error or result"));
        } else {
          accept(result2);
        }
      })
    );
    await mkdir(outputDir, { recursive: true });
    await writeFile(`${outputDir}/test-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 19)}.cpuprofile`, result);
    this.#profiler = void 0;
  }
}
export {
  testNode
};
//# sourceMappingURL=node.js.map
