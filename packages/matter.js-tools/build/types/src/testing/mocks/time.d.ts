/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
type TimerCallback = () => any;
declare class MockTimer {
    private readonly mockTime;
    private readonly durationMs;
    isRunning: boolean;
    private readonly callback;
    constructor(mockTime: MockTime, durationMs: number, callback: TimerCallback);
    start(): this;
    stop(): this;
}
type InterceptResult<T> = T extends Promise<T> ? {
    resolve: Awaited<T>;
    reject?: undefined;
} | {
    resolve?: undefined;
    reject: {};
} : {
    resolve: T;
    reject?: undefined;
} | {
    resolve?: void;
    reject: {};
};
export declare class MockTime {
    private startTimeMs;
    private callbacks;
    private timeMs;
    constructor(startTimeMs: number);
    reset(time?: number): void;
    now(): Date;
    nowMs(): number;
    getTimer(durationMs: number, callback: TimerCallback): MockTimer;
    getPeriodicTimer(intervalMs: number, callback: TimerCallback): MockTimer;
    /**
     * Move time forward.  Runs tasks scheduled during this interval.
     */
    advance(ms: number): Promise<void>;
    /**
     * Yield to scheduled microtasks.  This means that all code paths waiting
     * on resolved promises (including await) will proceed before this method
     * returns.
     */
    yield(): Promise<void>;
    /**
     * Due to its implementation, an older version of yield() would actually
     * yield to microtasks three times.  Our tests then depended on this
     * functionality -- one yield could trigger up to three nested awaits.
     *
     * To make this clear, the version of yield() that emulates old behavior
     * is called "yield3".
     */
    yield3(): Promise<void>;
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
    interceptOnce<NameT extends string, ReturnT, ObjT extends {
        [N in NameT]: (...args: any) => ReturnT;
    }>(obj: ObjT, method: NameT, interceptor: (result: InterceptResult<ReturnT>) => void | InterceptResult<ReturnT> | Promise<void> | Promise<InterceptResult<ReturnT>>): void;
    callbackAtTime(atMs: number, callback: TimerCallback): void;
    removeCallback(callbackToRemove: TimerCallback): void;
}
export declare const TheMockTime: MockTime;
export declare function timeSetup(Time: {
    get: () => MockTime;
}): void;
export {};
//# sourceMappingURL=time.d.ts.map