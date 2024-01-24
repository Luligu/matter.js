/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { spawn } from "child_process";
import { platform } from "os";
import colors from "ansi-colors";
async function execute(bin, argv) {
  return new Promise((resolve, reject) => {
    let finished = false;
    const options = {
      stdio: "inherit"
    };
    if (platform() === "win32") {
      options.shell = true;
    }
    const proc = spawn(bin, argv, options);
    proc.on("error", (e) => {
      finished = true;
      reject(e);
    });
    proc.on("close", (code) => {
      if (finished) {
        return;
      }
      finished = true;
      if (code === 0) {
        resolve();
      } else {
        reject(`Process ${bin} exited with code ${code}`);
      }
    });
  });
}
async function executeNode(script, argv) {
  argv = ["--enable-source-maps", script, ...argv];
  if (process.env.MATTER_RUN_ECHO) {
    const command = colors.whiteBright(`node ${argv.join(" ")}`);
    process.stdout.write(`${colors.greenBright("Matter execute:")} ${command}
`);
  }
  return execute("node", argv);
}
export {
  execute,
  executeNode
};
//# sourceMappingURL=execute.js.map
