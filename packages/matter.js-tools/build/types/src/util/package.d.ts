/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Progress } from "./progress.js";
export declare class Package {
    path: string;
    json: PackageJson;
    esm: boolean;
    cjs: boolean;
    src: boolean;
    tests: boolean;
    library: boolean;
    constructor({ path, name, }?: {
        path?: string;
        name?: string;
    });
    get name(): string;
    resolve(path: string): string;
    relative(path: string): string;
    start(what: string): Progress;
    lastModified(...paths: string[]): Promise<number>;
    private lastModifiedAbsolute;
    get dependencies(): string[];
    static set workingDir(wd: string);
    static node(name: string): Package;
    static get workspace(): Package;
    static get tools(): Package;
}
export type PackageJson = {
    name: string;
    version: string;
    [key: string]: any;
};
//# sourceMappingURL=package.d.ts.map