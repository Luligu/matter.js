/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Package } from "../util/package.js";
/**
 * Implements Typescript validation and declaration emit using tsc API.
 */
export declare class Typescript {
    private pkg;
    private options;
    private host;
    private constructor();
    static emitDeclarations(pkg: Package): void;
    static validateTypes(pkg: Package): void;
    private run;
    private getCompilerOptions;
    private passTscError;
    private passTscErrors;
    /**
     * As we largely configure based on convention, we mostly ignore
     * tsconfig.json files in project directories.  The limited number of
     * project-specific options we allow load here.
     */
    private loadPackageOptions;
}
//# sourceMappingURL=typescript.d.ts.map