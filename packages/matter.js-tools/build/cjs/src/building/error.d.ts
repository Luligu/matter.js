/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
export declare class InternalBuildError extends Error {
    constructor(message: string);
}
export declare class BuildError extends Error {
    readonly diagnostics: string;
    constructor(diagnostics: string);
}
//# sourceMappingURL=error.d.ts.map