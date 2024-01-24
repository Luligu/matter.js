/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Format } from "esbuild";
import { Package } from "../util/package.js";
export declare class Project {
    pkg: Package;
    constructor(source?: Package | string);
    buildSource(format: Format): Promise<void>;
    buildTests(format: Format): Promise<void>;
    clean(): Promise<void>;
    buildDeclarations(): Promise<void>;
    validateTypes(): Promise<void>;
    installDeclarationFormat(format: Format): Promise<void>;
    installDeclarations(): Promise<void>;
    recordBuildTime(): Promise<void>;
    private build;
    private specifyFormat;
    private targets;
}
export declare namespace Project {
    interface Config {
        before?: (project: Project, format: Format) => Promise<void>;
        after?: (project: Project, format: Format) => Promise<void>;
    }
}
//# sourceMappingURL=project.d.ts.map