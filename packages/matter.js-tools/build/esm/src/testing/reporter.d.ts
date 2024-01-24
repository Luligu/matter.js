/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Progress } from "../util/progress.js";
export type Stats = {
    total: number;
    complete: number;
    failures: number;
};
export interface Reporter {
    beginRun(name: string, stats: Stats): void;
    beginSuite(name: string[], stats: Stats): void;
    beginTest(name: string, stats: Stats): void;
    failTest(name: string, detail: FailureDetail): void;
    endRun(stats: Stats): void;
    failRun(message: string, stack?: string): void;
}
export type FailureDetail = {
    message: string;
    diff?: string;
    stack?: string;
    logs?: string;
};
export type Failure = {
    suite: string[];
    test: string;
    detail: FailureDetail;
};
export declare abstract class ProgressReporter implements Reporter {
    private progress;
    private run;
    private suite;
    private failures;
    private lastTitle?;
    constructor(progress: Progress);
    beginRun(name: string): void;
    beginSuite(name: string[]): void;
    beginTest(_name: string, stats: Stats): void;
    failTest(name: string, detail: FailureDetail): void;
    abstract failRun(message: string, stack?: string): void;
    endRun(stats: Stats): void;
    private summarize;
    private dumpFailures;
}
export declare class ConsoleProxyReporter implements Reporter {
    static FLAG: string;
    beginRun(name: string, stats: Stats): void;
    beginSuite(name: string[], stats: Stats): void;
    beginTest(name: string, stats: Stats): void;
    endRun(stats: Stats): void;
    failTest(name: string, detail: FailureDetail): void;
    failRun(message: string, stack?: string): void;
}
//# sourceMappingURL=reporter.d.ts.map