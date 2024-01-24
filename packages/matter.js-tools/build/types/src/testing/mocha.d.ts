/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import type MochaType from "mocha";
import { Reporter } from "./reporter.js";
export declare function generalSetup(Mocha: typeof MochaType): void;
export declare function adaptReporter(Mocha: typeof MochaType, title: string, reporter: Reporter): {
    new (runner: Mocha.Runner): {
        readonly translatedStats: {
            total: number;
            complete: number;
            failures: number;
        };
        stats: MochaType.Stats;
        failures: MochaType.Test[];
        runner: MochaType.Runner;
        epilogue(): void;
        done?(failures: number, fn?: ((failures: number) => void) | undefined): void;
    };
    color(type: string, str: string): string;
    generateDiff(actual: string, expected: string): string;
    list(failures: MochaType.Test[]): void;
    useColors: boolean;
    inlineDiffs: boolean;
    readonly colors: MochaType.reporters.Base.ColorMap;
    readonly symbols: MochaType.reporters.Base.SymbolMap;
    readonly window: {
        width: number;
    };
    cursor: typeof MochaType.reporters.Base.cursor;
};
export declare function browserSetup(mocha: BrowserMocha): void;
//# sourceMappingURL=mocha.d.ts.map