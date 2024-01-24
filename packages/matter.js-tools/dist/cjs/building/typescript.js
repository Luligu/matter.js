"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var typescript_exports = {};
__export(typescript_exports, {
  Typescript: () => Typescript
});
module.exports = __toCommonJS(typescript_exports);
var import_fs = require("fs");
var import_glob = require("glob");
var import_path = require("path");
var import_typescript = __toESM(require("typescript"), 1);
var import_package = require("../util/package.js");
var import_error = require("./error.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
class Typescript {
  constructor(pkg, options) {
    this.pkg = pkg;
    this.options = options;
    options = {
      ...options,
      rootDir: this.pkg.path
    };
    this.host = import_typescript.default.createIncrementalCompilerHost(options);
    const baseOptions = this.getCompilerOptions(import_package.Package.tools.resolve("tsconfig.base.json"));
    this.options = {
      ...baseOptions,
      incremental: true,
      isolatedModules: true,
      tsBuildInfoFile: pkg.resolve("build/tsbuildinfo"),
      rootDir: this.pkg.path,
      // So this guy is interesting.  It reduces redundant work and
      // drastically speeds things up so seems worthwhile.  May want to
      // enable in some nightly process but I think we're safe enough
      // as is
      skipLibCheck: true,
      ...options
    };
    delete options.composite;
    if (this.pkg.src) {
      this.loadPackageOptions("src/tsconfig.json");
    }
    if (this.pkg.tests) {
      this.loadPackageOptions("test/tsconfig.json");
    }
  }
  static emitDeclarations(pkg) {
    new Typescript(pkg, {
      outDir: pkg.resolve("build/types"),
      emitDeclarationOnly: true,
      sourceMap: true,
      declarationMap: true
    }).run();
  }
  static validateTypes(pkg) {
    new Typescript(pkg, {
      noEmit: true
    }).run();
  }
  run() {
    const sources = Array();
    if (this.pkg.src) {
      sources.push(...import_glob.glob.sync(this.pkg.resolve("src/**/*.ts").replace(/\\/g, "/")));
    }
    if (this.pkg.tests) {
      sources.push(...import_glob.glob.sync(this.pkg.resolve("test/**/*.ts").replace(/\\/g, "/")));
    }
    const program = import_typescript.default.createIncrementalProgram({
      rootNames: sources,
      options: this.options,
      host: this.host
    });
    const diagnostics = [
      ...program.getConfigFileParsingDiagnostics(),
      ...program.getSyntacticDiagnostics(),
      ...program.getOptionsDiagnostics(),
      ...program.getSemanticDiagnostics()
    ];
    if (!this.options.noEmit) {
      diagnostics.push(...program.emit().diagnostics);
    }
    this.passTscErrors(diagnostics);
  }
  getCompilerOptions(filename) {
    filename = this.pkg.resolve(filename);
    const file = import_typescript.default.readConfigFile(filename, import_typescript.default.sys.readFile);
    this.passTscError(file.error);
    const config = import_typescript.default.parseJsonConfigFileContent(file.config, import_typescript.default.sys, (0, import_path.dirname)(filename));
    this.passTscError(config.errors && config.errors[0]);
    return config.options;
  }
  passTscError(diagnostic) {
    if (diagnostic) {
      throw new import_error.InternalBuildError(import_typescript.default.formatDiagnostic(diagnostic, this.host));
    }
  }
  passTscErrors(diagnostics) {
    if (!diagnostics) {
      return;
    }
    if (!diagnostics.length) {
      return;
    }
    let formatted = import_typescript.default.formatDiagnosticsWithColorAndContext(diagnostics, this.host);
    formatted = formatted.replace(/\u001b\[96m/gms, "\n\x1B[96m");
    throw new import_error.BuildError(formatted);
  }
  /**
   * As we largely configure based on convention, we mostly ignore
   * tsconfig.json files in project directories.  The limited number of
   * project-specific options we allow load here.
   */
  loadPackageOptions(path) {
    const filename = this.pkg.resolve(path);
    if (!(0, import_fs.existsSync)(filename)) {
      return;
    }
    const options = this.getCompilerOptions(path);
    delete options?.composite;
    const types = options?.types;
    if (types) {
      if (this.options.types) {
        const merged = new Set(this.options.types);
        for (const type of types) {
          merged.add(type);
        }
        this.options.types = [...merged];
      } else {
        this.options.types = types;
      }
    }
  }
}
//# sourceMappingURL=typescript.js.map
