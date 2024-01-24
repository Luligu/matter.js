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
var logging_exports = {};
__export(logging_exports, {
  TheMockLogger: () => TheMockLogger,
  loggerSetup: () => loggerSetup
});
module.exports = __toCommonJS(logging_exports);
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
const TheMockLogger = {
  emitAll: false
};
function loggerSetup(Logger) {
  Logger.format = "ansi";
  let messageBuffer;
  const defaultLog = Logger.log;
  function passMessage(args) {
    defaultLog.apply(Logger, args);
  }
  function interceptingLogger(...args) {
    let emitAll = TheMockLogger.emitAll;
    if (MatterHooks?.loggerSink) {
      MatterHooks.loggerSink(...args);
    } else if (!emitAll) {
      if (messageBuffer) {
        messageBuffer.push(args);
      } else {
        emitAll = true;
      }
    }
    if (emitAll) {
      passMessage(args);
    }
  }
  Logger.log = interceptingLogger;
  beforeEach(function() {
    if (!TheMockLogger.emitAll) {
      messageBuffer = [];
    }
  });
  afterEach(function() {
    if (messageBuffer?.length) {
      if (this.currentTest?.isFailed()) {
        for (const args of messageBuffer) {
          passMessage(args);
        }
      }
      messageBuffer = void 0;
    }
  });
}
//# sourceMappingURL=logging.js.map
