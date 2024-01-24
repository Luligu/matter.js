/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Package } from "../util/package.js";
import { Progress } from "../util/progress.js";
import { TestOptions } from "./options.js";
import { Reporter } from "./reporter.js";
export declare class TestRunner {
    readonly pkg: Package;
    readonly progress: Progress;
    readonly options: TestOptions;
    readonly reporter: Reporter;
    private spec;
    constructor(pkg: Package, progress: Progress, options: TestOptions);
    runNode(format?: "esm" | "cjs"): Promise<void>;
    runWeb(manual?: boolean): Promise<void>;
    loadFiles(format: "esm" | "cjs"): string[];
    private run;
}
//# sourceMappingURL=runner.d.ts.map