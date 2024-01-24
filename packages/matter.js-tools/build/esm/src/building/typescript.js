/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { existsSync } from "fs";
import { glob } from "glob";
import { dirname } from "path";
import ts from "typescript";
import { Package } from "../util/package.js";
import { BuildError, InternalBuildError } from "./error.js";
class Typescript {
  constructor(pkg, options) {
    this.pkg = pkg;
    this.options = options;
    options = {
      ...options,
      rootDir: this.pkg.path
    };
    this.host = ts.createIncrementalCompilerHost(options);
    const baseOptions = this.getCompilerOptions(Package.tools.resolve("tsconfig.base.json"));
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
      sources.push(...glob.sync(this.pkg.resolve("src/**/*.ts").replace(/\\/g, "/")));
    }
    if (this.pkg.tests) {
      sources.push(...glob.sync(this.pkg.resolve("test/**/*.ts").replace(/\\/g, "/")));
    }
    const program = ts.createIncrementalProgram({
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
    const file = ts.readConfigFile(filename, ts.sys.readFile);
    this.passTscError(file.error);
    const config = ts.parseJsonConfigFileContent(file.config, ts.sys, dirname(filename));
    this.passTscError(config.errors && config.errors[0]);
    return config.options;
  }
  passTscError(diagnostic) {
    if (diagnostic) {
      throw new InternalBuildError(ts.formatDiagnostic(diagnostic, this.host));
    }
  }
  passTscErrors(diagnostics) {
    if (!diagnostics) {
      return;
    }
    if (!diagnostics.length) {
      return;
    }
    let formatted = ts.formatDiagnosticsWithColorAndContext(diagnostics, this.host);
    formatted = formatted.replace(/\u001b\[96m/gms, "\n\x1B[96m");
    throw new BuildError(formatted);
  }
  /**
   * As we largely configure based on convention, we mostly ignore
   * tsconfig.json files in project directories.  The limited number of
   * project-specific options we allow load here.
   */
  loadPackageOptions(path) {
    const filename = this.pkg.resolve(path);
    if (!existsSync(filename)) {
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
export {
  Typescript
};
//# sourceMappingURL=typescript.js.map
