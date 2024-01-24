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
var mocha_exports = {};
__export(mocha_exports, {
  adaptReporter: () => adaptReporter,
  browserSetup: () => browserSetup,
  generalSetup: () => generalSetup
});
module.exports = __toCommonJS(mocha_exports);
var import_options = require("./options.js");
var import_reporter = require("./reporter.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
function generalSetup(Mocha2) {
  Mocha2.reporters.Base.colors["diff added inline"] = "97;42;48;5;22";
  Mocha2.reporters.Base.colors["diff removed inline"] = "97;41;48;5;52";
  async function onlyLogFailure(fn) {
    if (!MatterHooks) {
      throw new Error("Matter hooks not loaded");
    }
    const logs = Array();
    const existingSink = MatterHooks.loggerSink;
    try {
      MatterHooks.loggerSink = (_, message) => {
        logs.push(message);
      };
      return await fn();
    } catch (e) {
      process.stdout.write(logs.join("\n"));
      throw e;
    } finally {
      MatterHooks.loggerSink = existingSink;
    }
  }
  function filterLogs(hook) {
    const actual = Mocha2.Suite.prototype[hook];
    Mocha2.Suite.prototype[hook] = function(fn) {
      return actual.call(this, async function(...args) {
        return await onlyLogFailure(() => fn.apply(this, args));
      });
    };
  }
  filterLogs("beforeAll");
  filterLogs("afterAll");
  filterLogs("beforeEach");
  filterLogs("afterEach");
  const actualBeforeAll = Mocha2.Suite.prototype.beforeAll;
  Mocha2.Suite.prototype.beforeAll = function(...args) {
    MockTime.reset();
    return actualBeforeAll.apply(this, args);
  };
}
function adaptReporter(Mocha2, title, reporter) {
  const RUNNER = Mocha2.Runner.constants;
  let logs = Array();
  class MochaReporter extends Mocha2.reporters.Base {
    constructor(runner) {
      super(runner);
      runner.once(RUNNER.EVENT_RUN_BEGIN, () => {
        if (!MatterHooks) {
          throw new Error("Matter hooks not loaded");
        }
        MatterHooks.loggerSink = (_, message) => {
          logs.push(message);
        };
        reporter.beginRun(title, this.translatedStats);
      });
      runner.on(RUNNER.EVENT_SUITE_BEGIN, (suite) => {
        reporter.beginSuite(suite.titlePath(), this.translatedStats);
      });
      runner.on(RUNNER.EVENT_TEST_BEGIN, (test) => {
        logs = test.logs = [];
        reporter.beginTest(test.title, this.translatedStats);
      });
      runner.on(RUNNER.EVENT_TEST_FAIL, (test, error) => {
        if (test.type === "hook") {
          const { message, stack } = parseError(error);
          reporter.failRun(`Aborting due to error in ${test.title}: ${message}`, stack);
          throw error;
        }
        const logs2 = test.logs;
        reporter.failTest(test.title, translateError(error, logs2));
      });
      runner.once(RUNNER.EVENT_RUN_END, () => {
        if (!MatterHooks) {
          throw new Error("Matter hooks not loaded");
        }
        MatterHooks.loggerSink = void 0;
        reporter.endRun(this.translatedStats);
      });
    }
    get translatedStats() {
      return {
        total: this.runner.total,
        complete: this.stats.tests,
        failures: this.stats.failures
      };
    }
  }
  function translateError(error, logs2) {
    let diff;
    const { message, stack } = parseError(error);
    if (error.expected && error.actual) {
      diff = Mocha2.reporters.Base.generateDiff(error.actual.toString(), error.expected.toString());
      diff = diff.trim().replace(/^ {6}/gms, "");
    }
    const result = { message };
    if (diff) {
      result.diff = diff;
    }
    if (stack) {
      result.stack = stack;
    }
    if (logs2.length) {
      result.logs = logs2.join("\n");
    }
    return result;
  }
  return MochaReporter;
}
function parseError(error) {
  let message, stack;
  if (error === void 0 || error === null) {
    message = `(error is ${error})`;
  } else {
    message = error.message;
  }
  if (error.stack) {
    let lines = error.stack.trim().split("\n");
    if (!message) {
      message = lines[0];
    }
    lines = lines.filter((line) => line.match(/:\d+:\d+\)?/));
    if (lines.length) {
      stack = lines.map((line) => line.trim()).join("\n");
    }
  } else if (error.message) {
    message = error.message;
  } else {
    message = error.toString();
  }
  message = message.trim().replace(/Error: /, "");
  if (message.endsWith(":")) {
    message = message.slice(0, message.length - 1);
  }
  return { message, stack };
}
function browserSetup(mocha) {
  mocha.setup("bdd");
  globalThis.MatterTest = {
    // Starts Mocha (called by clicking link)
    start: () => {
      const root = document.querySelector("#mocha");
      if (root) {
        root.innerHTML = "";
      }
      return mocha.run();
    },
    // Start Mocha, proxying reporting through console to Playwright and
    // completing once Mocha has finished
    auto: async function(options) {
      import_options.TestOptions.apply(mocha, options);
      mocha.reporter(adaptReporter(Mocha, "Web", new import_reporter.ConsoleProxyReporter()));
      return new Promise((accept) => {
        const runner = this.start();
        runner.on("end", accept);
      });
    }
  };
}
//# sourceMappingURL=mocha.js.map
