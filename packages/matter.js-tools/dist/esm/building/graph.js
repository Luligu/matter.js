/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import mapWorkspaces from "@npmcli/map-workspaces";
import colors from "ansi-colors";
import { Package } from "../util/package.js";
import { Progress } from "../util/progress.js";
import { InternalBuildError } from "./error.js";
import { Project } from "./project.js";
class Graph {
  constructor(nodes) {
    this.nodes = nodes;
  }
  static async load(pkg = Package.workspace) {
    const workspaces = await mapWorkspaces({ pkg: pkg.json, cwd: pkg.path });
    const nodeMap = {};
    const allDeps = {};
    for (const path of workspaces.values()) {
      const pkg2 = new Package({ path });
      allDeps[pkg2.json.name] = pkg2.dependencies;
      nodeMap[pkg2.json.name] = {
        pkg: pkg2,
        dependencies: [],
        buildTime: 0,
        modifyTime: 0,
        get dirty() {
          return this.modifyTime > this.buildTime || !!this.dependencies.find((d) => d.dirty || d.buildTime > this.buildTime);
        }
      };
    }
    for (const name in allDeps) {
      for (const dep of allDeps[name]) {
        const depNode = nodeMap[dep];
        if (depNode && depNode !== nodeMap[name]) {
          nodeMap[name].dependencies.push(depNode);
        }
      }
    }
    const graph = new Graph(Object.values(nodeMap));
    await Promise.all(
      graph.nodes.map(async (node) => {
        node.buildTime = await node.pkg.lastModified("build/timestamp");
        node.modifyTime = await node.pkg.lastModified("package-lock.json", "src", "test");
        return node;
      })
    );
    const stack = Array();
    function findCircular(node) {
      if (stack.indexOf(node) !== -1) {
        stack.push(node);
        throw new InternalBuildError(`Circular dependency: ${stack.map(formatDep).join(" \u25B8 ")}`);
      }
      stack.push(node);
      for (const dep of node.dependencies) {
        findCircular(dep);
      }
      stack.pop();
    }
    for (const node of graph.nodes) {
      findCircular(node);
    }
    return graph;
  }
  // TODO - parallelization will be trivial except need to update Progress
  // to support display of multiple simultaneous tasks
  async build(builder) {
    const toBuild = new Set(this.nodes);
    while (toBuild.size) {
      let node;
      nodes:
        for (node of toBuild) {
          for (const dep of node.dependencies) {
            if (dep.dirty) {
              continue nodes;
            }
          }
          break;
        }
      if (!node) {
        throw new Error("Internal logic error: No unbuilt project has fully built dependencies");
      }
      if (node.dirty || builder.unconditional) {
        await builder.build(new Project(node.pkg));
        node.buildTime = Date.now();
      } else {
        new Progress().skip("Up to date", node.pkg);
      }
      toBuild.delete(node);
    }
  }
  display() {
    for (const node of this.nodes) {
      const progress = node.pkg.start("Node");
      progress.info("path", node.pkg.path);
      progress.info("modified", formatTime(node.modifyTime));
      progress.info("built", formatTime(node.buildTime));
      progress.info("dirty", node.dirty ? colors.dim.red("yes") : colors.dim.green("no"));
      progress.info("dependencies", node.dependencies.map(formatDep).join(", "));
      progress.shutdown();
    }
  }
}
function formatTime(time) {
  if (!time) {
    return colors.dim.red("never");
  }
  return new Date(time - (/* @__PURE__ */ new Date()).getTimezoneOffset()).toISOString().split(".")[0].replace("T", " ");
}
function formatDep(node) {
  return node.pkg.name.replace(/^@project-chip\//, "");
}
export {
  Graph
};
//# sourceMappingURL=graph.js.map
