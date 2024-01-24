/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import colors from "ansi-colors";
import { stdout } from "process";
const actualWrite = process.stdout.write;
const FRONT = "\x1B[G";
const CLEAR = "\x1B[K";
function packageIdentity(pkg) {
  return `${colors.bold(pkg.json.name)}@${pkg.json.version}`;
}
class Progress {
  constructor() {
    this.status = Progress.Status.Startup;
  }
  skip(why, pkg) {
    this.write(colors.dim(`Skip ${packageIdentity(pkg)}: ${why}

`));
  }
  startup(what, pkg) {
    this.status = Progress.Status.Startup;
    this.write(`${what} ${packageIdentity(pkg)}
`);
  }
  update(text, extra) {
    this.status = Progress.Status.Ongoing;
    let duration;
    if (this.start === void 0) {
      this.start = (/* @__PURE__ */ new Date()).getTime();
      duration = "";
    } else {
      duration = this.duration;
    }
    extra = extra === void 0 ? "" : ` ${extra}`;
    this.write(`${CLEAR}  ${colors.yellow("\u29D7")} ${text} ${duration}${extra}${FRONT}`);
    stdout.write("\r");
  }
  success(text) {
    this.status = Progress.Status.Success;
    this.write(`${CLEAR}  ${colors.green("\u2714")} ${text} ${this.duration}
`);
    delete this.start;
  }
  failure(text) {
    this.status = Progress.Status.Failure;
    this.write(`${CLEAR}  ${colors.redBright("\u2717")} ${text} ${this.duration}
`);
    delete this.start;
  }
  info(label, value) {
    if (value) {
      label = `${colors.dim(label)} ${value}`;
    }
    this.write(`${CLEAR}  ${colors.dim("\u2023")} ${label}
`);
  }
  shutdown() {
    stdout.write("\n");
  }
  async run(what, fn) {
    this.update(what);
    await fn();
    this.success(what);
  }
  write(text) {
    if (this.lastLine === text) {
      return;
    }
    actualWrite.call(process.stdout, this.lastLine = text);
  }
  get duration() {
    let ms = this.start ? (/* @__PURE__ */ new Date()).getTime() - this.start : 0;
    if (ms < 1e3) {
      ms = Math.round(ms / 10) / 100;
    } else if (ms < 1e4) {
      ms = Math.round(ms / 100) / 10;
    } else {
      ms = Math.trunc(ms / 1e3);
    }
    return colors.dim.yellow(`(${ms}s)`);
  }
}
((Progress2) => {
  let Status;
  ((Status2) => {
    Status2["Startup"] = "startup";
    Status2["Ongoing"] = "ongoing";
    Status2["Success"] = "success";
    Status2["Failure"] = "failure";
  })(Status = Progress2.Status || (Progress2.Status = {}));
})(Progress || (Progress = {}));
export {
  Progress
};
//# sourceMappingURL=progress.js.map
