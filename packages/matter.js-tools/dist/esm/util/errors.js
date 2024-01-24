/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
async function ignoreError(code, fn) {
  try {
    return await fn();
  } catch (e) {
    if (e.code !== code) {
      throw e;
    }
  }
}
function ignoreErrorSync(code, fn) {
  try {
    return fn();
  } catch (e) {
    if (e.code !== code) {
      throw e;
    }
  }
}
export {
  ignoreError,
  ignoreErrorSync
};
//# sourceMappingURL=errors.js.map
