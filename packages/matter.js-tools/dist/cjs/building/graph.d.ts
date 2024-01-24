/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Package } from "../util/package.js";
import { Builder } from "./builder.js";
/**
 * Graph of dependencies for workspace packages.
 *
 * We use this information to determine which packages are "dirty" and need
 * rebuild.  In the future we can also use for parallel build, only tricky
 * part there is showing status.
 */
export declare class Graph {
    readonly nodes: Graph.Node[];
    protected constructor(nodes: Graph.Node[]);
    static load(pkg?: Package): Promise<Graph>;
    build(builder: Builder): Promise<void>;
    display(): void;
}
export declare namespace Graph {
    interface Node {
        pkg: Package;
        dependencies: Node[];
        buildTime: number;
        modifyTime: number;
        dirty: boolean;
    }
}
//# sourceMappingURL=graph.d.ts.map