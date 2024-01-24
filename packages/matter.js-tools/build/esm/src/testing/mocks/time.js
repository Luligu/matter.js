/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
class MockTimer {
  constructor(mockTime, durationMs, callback) {
    this.mockTime = mockTime;
    this.durationMs = durationMs;
    this.isRunning = false;
    if (this instanceof MockInterval) {
      this.callback = callback;
    } else {
      this.callback = () => {
        this.isRunning = false;
        callback();
      };
    }
  }
  start() {
    this.mockTime.callbackAtTime(this.mockTime.nowMs() + this.durationMs, this.callback);
    this.isRunning = true;
    return this;
  }
  stop() {
    this.mockTime.removeCallback(this.callback);
    this.isRunning = false;
    return this;
  }
}
class MockInterval extends MockTimer {
  constructor(mockTime, durationMs, callback) {
    const intervalCallback = async () => {
      mockTime.callbackAtTime(mockTime.nowMs() + durationMs, intervalCallback);
      await callback();
    };
    super(mockTime, durationMs, intervalCallback);
  }
}
function isAsync(fn) {
  return fn.constructor.name === "AsyncFunction";
}
class MockTime {
  constructor(startTimeMs) {
    this.startTimeMs = startTimeMs;
    this.callbacks = new Array();
    this.timeMs = this.startTimeMs;
  }
  reset(time = this.startTimeMs) {
    this.callbacks = [];
    this.timeMs = time;
  }
  now() {
    return new Date(this.timeMs);
  }
  nowMs() {
    return this.timeMs;
  }
  getTimer(durationMs, callback) {
    return new MockTimer(this, durationMs, callback);
  }
  getPeriodicTimer(intervalMs, callback) {
    return new MockInterval(this, intervalMs, callback);
  }
  /**
   * Move time forward.  Runs tasks scheduled during this interval.
   */
  async advance(ms) {
    const newTimeMs = this.timeMs + ms;
    while (true) {
      if (this.callbacks.length === 0)
        break;
      const { atMs, callback } = this.callbacks[0];
      if (atMs > newTimeMs)
        break;
      this.callbacks.shift();
      this.timeMs = atMs;
      await callback();
    }
    this.timeMs = newTimeMs;
  }
  /**
   * Yield to scheduled microtasks.  This means that all code paths waiting
   * on resolved promises (including await) will proceed before this method
   * returns.
   */
  async yield() {
    await Promise.resolve();
  }
  /**
   * Due to its implementation, an older version of yield() would actually
   * yield to microtasks three times.  Our tests then depended on this
   * functionality -- one yield could trigger up to three nested awaits.
   *
   * To make this clear, the version of yield() that emulates old behavior
   * is called "yield3".
   */
  async yield3() {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  }
  /**
   * Hook a method and invoke a callback just before the method completes.
   * Unhooks after completion.
   *
   * Handles both synchronous and asynchronous methods.  The interceptor
   * should match the async-ness of the intercepted method.
   *
   * The interceptor can optionally access and/or replace the resolve/reject
   * value.
   */
  interceptOnce(obj, method, interceptor) {
    const original = obj[method];
    if (!original) {
      throw new Error(`Interception method ${method} is not present`);
    }
    let result;
    if (isAsync(interceptor)) {
      obj[method] = async function(...args) {
        try {
          const resolve = await original.apply(this, args);
          result = { resolve };
        } catch (reject) {
          result = { reject };
        } finally {
          obj[method] = original;
        }
        result = await interceptor(result) ?? result;
        if (result.reject) {
          throw result.reject;
        }
        return result.resolve;
      };
    } else {
      obj[method] = function(...args) {
        try {
          const resolve = original.apply(this, args);
          result = { resolve };
        } catch (reject) {
          result = { reject };
        } finally {
          obj[method] = original;
        }
        result = interceptor(result) ?? result;
        if (result.reject) {
          throw result.reject;
        }
        return result.resolve;
      };
    }
  }
  callbackAtTime(atMs, callback) {
    this.callbacks.push({ atMs, callback });
    this.callbacks.sort(({ atMs: atMsA }, { atMs: atMsB }) => atMsA - atMsB);
  }
  removeCallback(callbackToRemove) {
    const index = this.callbacks.findIndex(({ callback }) => callbackToRemove === callback);
    if (index === -1)
      return;
    this.callbacks.splice(index, 1);
  }
}
const TheMockTime = new MockTime(0);
function timeSetup(Time) {
  Time.get = () => TheMockTime;
}
export {
  MockTime,
  TheMockTime,
  timeSetup
};
//# sourceMappingURL=time.js.map
