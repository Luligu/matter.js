/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import type { TestRunner } from "./runner.js";
import "./global-definitions.js";
export declare function testNode(runner: TestRunner, format: "cjs" | "esm"): Promise<void>;
export interface Profilerish {
    setGenerateType(value: number): void;
    startProfiling(): void;
    stopProfiling(): {
        export(callback: (error: any, result: string) => any): void;
    };
}
//# sourceMappingURL=node.d.ts.map