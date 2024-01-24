/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="mocha" />
export type TestOptions = {
    spec?: string | string[];
    profile?: boolean;
    grep?: string;
    fgrep?: string;
    invert?: boolean;
    allLogs?: boolean;
};
export declare namespace TestOptions {
    function apply(mocha: Mocha, options: TestOptions): void;
}
//# sourceMappingURL=options.d.ts.map