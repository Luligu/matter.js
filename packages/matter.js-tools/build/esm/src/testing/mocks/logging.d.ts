/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
interface LoggerLike {
    format: string;
    log(level: number, message: string): void;
}
export interface MockLogger {
    emitAll: boolean;
}
export declare const TheMockLogger: MockLogger;
export declare function loggerSetup(Logger: LoggerLike): void;
export {};
//# sourceMappingURL=logging.d.ts.map