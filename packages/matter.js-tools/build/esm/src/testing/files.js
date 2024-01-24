/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { existsSync } from "fs";
import { Package } from "../util/package.js";
function listSupportFiles(format = "cjs") {
  const files = Array();
  files.push(Package.tools.resolve("dist/esm/testing/global-definitions.js"));
  files.push(Package.tools.resolve("dist/esm/testing/mocks/index.js"));
  const config = new Package().resolve(`build/${format}/test/test.config.js`);
  if (existsSync(config)) {
    files.push(config);
  }
  return files;
}
export {
  listSupportFiles
};
//# sourceMappingURL=files.js.map
