"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var graph_exports = {};
__export(graph_exports, {
  Graph: () => Graph
});
module.exports = __toCommonJS(graph_exports);
var import_map_workspaces = __toESM(require("@npmcli/map-workspaces"), 1);
var import_ansi_colors = __toESM(require("ansi-colors"), 1);
var import_package = require("../util/package.js");
var import_progress = require("../util/progress.js");
var import_error = require("./error.js");
var import_project = require("./project.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
class Graph {
  constructor(nodes) {
    this.nodes = nodes;
  }
  static async load(pkg = import_package.Package.workspace) {
    const workspaces = await (0, import_map_workspaces.default)({ pkg: pkg.json, cwd: pkg.path });
    const nodeMap = {};
    const allDeps = {};
    for (const path of workspaces.values()) {
      const pkg2 = new import_package.Package({ path });
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
        throw new import_error.InternalBuildError(`Circular dependency: ${stack.map(formatDep).join(" \u25B8 ")}`);
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
        await builder.build(new import_project.Project(node.pkg));
        node.buildTime = Date.now();
      } else {
        new import_progress.Progress().skip("Up to date", node.pkg);
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
      progress.info("dirty", node.dirty ? import_ansi_colors.default.dim.red("yes") : import_ansi_colors.default.dim.green("no"));
      progress.info("dependencies", node.dependencies.map(formatDep).join(", "));
      progress.shutdown();
    }
  }
}
function formatTime(time) {
  if (!time) {
    return import_ansi_colors.default.dim.red("never");
  }
  return new Date(time - (/* @__PURE__ */ new Date()).getTimezoneOffset()).toISOString().split(".")[0].replace("T", " ");
}
function formatDep(node) {
  return node.pkg.name.replace(/^@project-chip\//, "");
}
//# sourceMappingURL=graph.js.map
