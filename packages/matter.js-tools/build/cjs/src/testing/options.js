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
var options_exports = {};
__export(options_exports, {
  TestOptions: () => TestOptions
});
module.exports = __toCommonJS(options_exports);
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
//# sourceMappingURL=options.js.map
