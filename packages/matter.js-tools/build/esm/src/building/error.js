/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
class InternalBuildError extends Error {
  constructor(message) {
    super(message);
  }
}
class BuildError extends Error {
  constructor(diagnostics) {
    super();
    this.diagnostics = diagnostics;
  }
}
export {
  BuildError,
  InternalBuildError
};
//# sourceMappingURL=error.js.map
