/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import colors from "ansi-colors";
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
    const complete = colors.dim(`${stats.complete}/${stats.total}`);
    const failures = stats.failures ? colors.redBright(` ${stats.failures.toString()} failed`) : "";
    return `${colors.bold(this.run)} ${complete}${failures}`;
  }
  dumpFailures() {
    for (let i = 0; i < this.failures.length; i++) {
      const failure = this.failures[i];
      const index = colors.redBright(`Failure ${colors.bold((i + 1).toString())} of ${this.failures.length}`);
      process.stdout.write(`
${index} ${failure.suite.join(" \u27A1 ")} \u27A1 ${colors.bold(failure.test)}

`);
      process.stdout.write(`  ${failure.detail.message}

`);
      if (failure.detail.diff) {
        process.stdout.write(`      ${failure.detail.diff.replace(/\n/gm, "\n      ")}

`);
      }
      if (failure.detail.stack) {
        process.stdout.write(`  ${colors.dim(failure.detail.stack.replace(/\n/gm, "\n  "))}

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
export {
  ConsoleProxyReporter,
  ProgressReporter
};
//# sourceMappingURL=reporter.js.map
