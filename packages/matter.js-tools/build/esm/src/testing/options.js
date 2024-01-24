/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
function option(options, name) {
  if (options[name] !== void 0 && options[name] !== null) {
    return options[name];
  }
  if (typeof process === "undefined") {
    return;
  }
  return process.env?.["MATTER_" + name.match(/(.[^A-Z]+)/g)?.map((s) => s.toUpperCase()).join("_")];
}
var TestOptions;
((TestOptions2) => {
  function apply(mocha, options) {
    const grep = option(options, "grep");
    if (grep) {
      mocha.grep(grep);
    }
    const fgrep = option(options, "fgrep");
    if (fgrep) {
      mocha.fgrep(fgrep);
    }
    const invert = option(options, "invert");
    if (invert) {
      mocha.invert();
    }
    const allLogs = option(options, "allLogs");
    if (allLogs) {
      if (typeof MockLogger !== "undefined") {
        MockLogger.emitAll = true;
      }
    }
  }
  TestOptions2.apply = apply;
})(TestOptions || (TestOptions = {}));
export {
  TestOptions
};
//# sourceMappingURL=options.js.map
