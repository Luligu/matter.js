/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Project } from "./project.js";
export declare enum Target {
    clean = "clean",
    types = "types",
    esm = "esm",
    cjs = "cjs"
}
export interface Options {
    targets?: Target[];
    prefix?: string;
    clean?: boolean;
}
/**
 * High-level build coordination.
 *
 * Warning: This class is intended for command line use and process.exit if
 * things go wrong.
 */
export declare class Builder {
    private options;
    unconditional: boolean;
    constructor(options: Options);
    build(project: Project): Promise<void>;
    private doBuild;
    private transpile;
    private selectTargets;
}
//# sourceMappingURL=builder.d.ts.map