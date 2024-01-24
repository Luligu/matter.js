/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Package } from "./package.js";
export declare class Progress {
    status: Progress.Status;
    private start?;
    private lastLine?;
    constructor();
    skip(why: string, pkg: Package): void;
    startup(what: string, pkg: Package): void;
    update(text: string, extra?: string): void;
    success(text: string): void;
    failure(text: string): void;
    info(label: string, value?: any): void;
    shutdown(): void;
    run(what: string, fn: () => Promise<void>): Promise<void>;
    protected write(text: string): void;
    private get duration();
}
export declare namespace Progress {
    enum Status {
        Startup = "startup",
        Ongoing = "ongoing",
        Success = "success",
        Failure = "failure"
    }
}
//# sourceMappingURL=progress.d.ts.map