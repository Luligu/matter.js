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
export {
  TheMockLogger,
  loggerSetup
};
//# sourceMappingURL=logging.js.map
