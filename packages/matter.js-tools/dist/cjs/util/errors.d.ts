/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
export declare function ignoreError<T>(code: string, fn: () => Promise<T>): Promise<T | undefined>;
export declare function ignoreErrorSync<T>(code: string, fn: () => T): T | undefined;
//# sourceMappingURL=errors.d.ts.map