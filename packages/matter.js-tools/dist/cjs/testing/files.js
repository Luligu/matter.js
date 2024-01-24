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
var files_exports = {};
__export(files_exports, {
  listSupportFiles: () => listSupportFiles
});
module.exports = __toCommonJS(files_exports);
var import_fs = require("fs");
var import_package = require("../util/package.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
function listSupportFiles(format = "cjs") {
  const files = Array();
  files.push(import_package.Package.tools.resolve("dist/esm/testing/global-definitions.js"));
  files.push(import_package.Package.tools.resolve("dist/esm/testing/mocks/index.js"));
  const config = new import_package.Package().resolve(`build/${format}/test/test.config.js`);
  if ((0, import_fs.existsSync)(config)) {
    files.push(config);
  }
  return files;
}
//# sourceMappingURL=files.js.map
