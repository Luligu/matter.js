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
var web_exports = {};
__export(web_exports, {
  testWeb: () => testWeb
});
module.exports = __toCommonJS(web_exports);
var import_esbuild = require("esbuild");
var import_express = __toESM(require("express"), 1);
var import_promises = require("fs/promises");
var import_path = require("path");
var import_playwright = require("playwright");
var import_errors = require("../util/errors.js");
var import_package = require("../util/package.js");
var import_reporter = require("./reporter.js");
/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
const libraries = ["chai", "chai-as-promised", "elliptic", "bn.js", "ansi-colors"];
async function testWeb(runner, manual) {
  await buildLibraries();
  const files = runner.loadFiles("esm");
  const server = await new Promise((resolve, reject) => {
    try {
      const server2 = (0, import_express.default)().use(import_express.default.static(import_package.Package.workspace.resolve("node_modules"))).use(import_express.default.static(import_package.Package.workspace.path)).get("/", (_, res) => res.send(buildIndex(files))).listen(0, "localhost", () => resolve(server2));
    } catch (e) {
      reject(e);
    }
  });
  const addr = server.address();
  let ip = addr.address;
  if (ip.indexOf(":") !== -1) {
    ip = `[${ip}]`;
  }
  const url = `http://${ip}:${addr.port}/`;
  await new Promise((resolve, reject) => {
    server.on("error", reject);
    server.on("close", resolve);
    if (manual) {
      console.log(`Run tests manually at ${url}`);
    } else {
      testInBrowser(url, runner.reporter, runner.options).then(() => {
        server.close(() => {
          resolve();
        });
      }).catch((error) => {
        reject(error);
      });
    }
  });
}
async function testInBrowser(url, reporter, options) {
  async function setup() {
    const browser = await import_playwright.chromium.launch();
    const page = await browser.newPage();
    return { browser, page };
  }
  async function run({ browser, page }) {
    await page.goto(url);
    await page.evaluate((options2) => globalThis.MatterTest.auto(options2), options);
    await browser.close();
  }
  await new Promise((resolve, reject) => {
    setup().then((cx) => {
      cx.page.on("console", consoleHandler(reporter));
      cx.page.on("pageerror", (error) => reject(error));
      return cx;
    }).then(run).then(resolve).catch(reject);
  });
}
function consoleHandler(reporter) {
  return (message) => {
    const type = message.type();
    switch (type) {
      case "log":
      case "debug":
      case "info":
      case "error":
      case "warn":
      case "trace":
        break;
      default:
        return;
    }
    const text = message.text();
    if (type !== "log" || !text.startsWith(import_reporter.ConsoleProxyReporter.FLAG)) {
      console[type](text);
      return;
    }
    const args = JSON.parse(text.slice(import_reporter.ConsoleProxyReporter.FLAG.length));
    const method = reporter[args[0]];
    if (typeof method !== "function") {
      throw new Error(`Invalid encoded reporter update method ${args[0]}`);
    }
    method.call(reporter, ...args.slice(1));
  };
}
function buildIndex(files) {
  const importMap = JSON.stringify({
    imports: Object.fromEntries(
      libraries.map((name) => {
        let path = `/packages/matter.js-tools/build/lib/${name}`;
        if (!path.endsWith(".js")) {
          path = `${path}.js`;
        }
        return [name, path];
      })
    )
  });
  files = files.map((file) => `/${(0, import_path.relative)(import_package.Package.workspace.path, file)}`);
  const imports = files.map((file) => `import ${JSON.stringify(file)}`).join("\n    ");
  return `<!DOCTYPE html>
<html>
<head>
    <title>Matter.js Web Testing</title>
    <link rel="stylesheet" href="mocha/mocha.css">
</head>
<body>
    <div id="mocha"><h1><a href="javascript:MatterTest.start()">run tests</a></h1></div>
    <script src="mocha/mocha.js"><\/script>
    <script type="importmap">
    ${importMap}
    <\/script>
    <script type="module">
    ${imports}
    <\/script>
</body>
</html>`;
}
async function buildLibraries() {
  for (const name of libraries) {
    let path = `build/lib/${name}`;
    if (!path.endsWith(".js")) {
      path = `${path}.js`;
    }
    const outfile = import_package.Package.tools.resolve(path);
    if ((await (0, import_errors.ignoreError)("ENOENT", async () => (0, import_promises.stat)(outfile)))?.isFile()) {
      continue;
    }
    await (0, import_esbuild.build)({
      entryPoints: [import_package.Package.workspace.resolve(`node_modules/${name}`)],
      bundle: true,
      format: "esm",
      outfile
    });
  }
}
//# sourceMappingURL=web.js.map
