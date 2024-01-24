"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_chai = __toESM(require("chai"), 1);
var import_chai_as_promised = __toESM(require("chai-as-promised"), 1);
var import_mocha = require("./mocha.js");
var import_crypto = require("./mocks/crypto.js");
var import_logging = require("./mocks/logging.js");
var import_time = require("./mocks/time.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import_chai.default.use(import_chai_as_promised.default);
Object.assign(globalThis, {
  expect: import_chai.default.expect
});
Object.assign(globalThis, {
  MatterHooks: {
    loggerSetup: import_logging.loggerSetup,
    timeSetup: import_time.timeSetup,
    cryptoSetup: import_crypto.cryptoSetup
  },
  MockTime: import_time.TheMockTime,
  MockLogger: import_logging.TheMockLogger
});
if (typeof window === "object" && globalThis === window) {
  (0, import_mocha.generalSetup)(Mocha);
  (0, import_mocha.browserSetup)(mocha);
}
//# sourceMappingURL=global-definitions.js.map
