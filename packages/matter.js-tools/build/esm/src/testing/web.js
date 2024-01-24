/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { build } from "esbuild";
import express from "express";
import { stat } from "fs/promises";
import { relative } from "path";
import { chromium } from "playwright";
import { ignoreError } from "../util/errors.js";
import { Package } from "../util/package.js";
import { ConsoleProxyReporter } from "./reporter.js";
const libraries = ["chai", "chai-as-promised", "elliptic", "bn.js", "ansi-colors"];
async function testWeb(runner, manual) {
  await buildLibraries();
  const files = runner.loadFiles("esm");
  const server = await new Promise((resolve, reject) => {
    try {
      const server2 = express().use(express.static(Package.workspace.resolve("node_modules"))).use(express.static(Package.workspace.path)).get("/", (_, res) => res.send(buildIndex(files))).listen(0, "localhost", () => resolve(server2));
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
    const browser = await chromium.launch();
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
    if (type !== "log" || !text.startsWith(ConsoleProxyReporter.FLAG)) {
      console[type](text);
      return;
    }
    const args = JSON.parse(text.slice(ConsoleProxyReporter.FLAG.length));
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
  files = files.map((file) => `/${relative(Package.workspace.path, file)}`);
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
    const outfile = Package.tools.resolve(path);
    if ((await ignoreError("ENOENT", async () => stat(outfile)))?.isFile()) {
      continue;
    }
    await build({
      entryPoints: [Package.workspace.resolve(`node_modules/${name}`)],
      bundle: true,
      format: "esm",
      outfile
    });
  }
}
export {
  testWeb
};
//# sourceMappingURL=web.js.map
