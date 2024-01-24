/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import Chai from "chai";
import ChaiAsPromised from "chai-as-promised";
import { browserSetup, generalSetup } from "./mocha.js";
import { cryptoSetup } from "./mocks/crypto.js";
import { TheMockLogger, loggerSetup } from "./mocks/logging.js";
import { TheMockTime, timeSetup } from "./mocks/time.js";
Chai.use(ChaiAsPromised);
Object.assign(globalThis, {
  expect: Chai.expect
});
Object.assign(globalThis, {
  MatterHooks: {
    loggerSetup,
    timeSetup,
    cryptoSetup
  },
  MockTime: TheMockTime,
  MockLogger: TheMockLogger
});
if (typeof window === "object" && globalThis === window) {
  generalSetup(Mocha);
  browserSetup(mocha);
}
//# sourceMappingURL=global-definitions.js.map
