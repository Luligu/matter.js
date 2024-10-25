/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { NodeActivity } from "#behavior/context/NodeActivity.js";
import { IndexBehavior } from "#behavior/system/index/IndexBehavior.js";
import { NetworkRuntime } from "#behavior/system/network/NetworkRuntime.js";
import { PartsBehavior } from "#behavior/system/parts/PartsBehavior.js";
import { Endpoint } from "#endpoint/Endpoint.js";
import { MutableEndpoint } from "#endpoint/index.js";
import { EndpointType } from "#endpoint/type/EndpointType.js";
import {
    Construction,
    Diagnostic,
    DiagnosticSource,
    Environment,
    Identity,
    ImplementationError,
    Logger,
    RuntimeService,
} from "#general";
import { RootEndpoint } from "../endpoints/root.js";
import { NodeLifecycle } from "./NodeLifecycle.js";

const logger = Logger.get("Node");

/**
 * A Matter Node.
 *
 * In Matter, a "node" is an individually addressable top-level network resource.
 */
export abstract class Node<T extends Node.CommonRootEndpoint = Node.CommonRootEndpoint> extends Endpoint<T> {
    #environment: Environment;
    #runtime?: NetworkRuntime;

    constructor(config: Node.Configuration<T>) {
        const parentEnvironment = config.environment ?? config.owner?.env ?? Environment.default;

        if (config.id === undefined) {
            config.id = `node${parentEnvironment.vars.increment("node.nextFallbackId")}`;
        }

        super(config);

        // We create a local environment so nodes can offer node-specific services via the environment
        this.#environment = new Environment(config.id, parentEnvironment);

        this.#environment.set(NodeActivity, new NodeActivity());

        if (this.lifecycle.hasNumber) {
            if (this.number !== 0) {
                throw new ImplementationError("The root endpoint ID must be 0");
            }
        } else {
            this.number = 0;
        }

        this.lifecycle.online.on(() => {
            this.statusUpdate("is online");
        });

        this.lifecycle.offline.on(() => {
            this.statusUpdate("is offline");
        });
    }

    override get env() {
        return this.#environment;
    }

    protected override createLifecycle(): NodeLifecycle {
        return new NodeLifecycle(this);
    }

    /**
     * Bring the node online.
     */
    async start() {
        this.env.runtime.add(this);

        try {
            await this.construction.ready;

            if (this.#runtime) {
                return;
            }

            this.statusUpdate("going online");

            this.#runtime = this.createRuntime();
            this.#runtime.construction.start();
            await this.#runtime.construction.ready;
        } catch (e) {
            this.env.runtime.delete(this);
            throw e;
        }
    }

    /**
     * @deprecated use {@link start}
     */
    async bringOnline() {
        return this.start();
    }

    /**
     * Run the node in standalone mode.  Returns when the node is closed.
     */
    async run() {
        await this.start();
        await this.construction.closed;
    }

    /**
     * Take the node offline but leave state and structure intact.  Happens automatically on close.
     *
     * Once the node is offline you may use {@link start} to bring the node online again.
     */
    async cancel() {
        if (!this.#runtime) {
            return;
        }

        this.statusUpdate("going offline");
        await this.#runtime?.close();
        this.#runtime = undefined;
    }

    override async close() {
        // The runtime is not designed to operate with a node that is shutting down so destroy it before performing
        // actual close
        //
        // TODO - this should probably block other functions like start()
        if (this.#runtime) {
            await this.cancel();
        }

        await super.close();
    }

    /**
     * Create the network runtime.
     */
    protected abstract createRuntime(): NetworkRuntime;

    get [RuntimeService.label]() {
        return ["Runtime for", Diagnostic.strong(this.toString())];
    }

    override get [Diagnostic.value](): unknown {
        const nodeActivity = this.#environment.get(NodeActivity);
        using _activity = nodeActivity.begin("diagnostics");
        return Diagnostic.node("🧩", this.id, {
            children: [
                Diagnostic.strong("Structure"),
                Diagnostic.list([super[Diagnostic.value]]),
                Diagnostic.strong("Activity"),
                nodeActivity[Diagnostic.value],
            ],
        });
    }

    override get lifecycle(): NodeLifecycle {
        return super.lifecycle as NodeLifecycle;
    }

    protected statusUpdate(message: string) {
        logger.notice(Diagnostic.strong(this.toString()), message);
    }

    override async [Construction.destruct]() {
        await this.cancel();
        await super[Construction.destruct]();
        DiagnosticSource.delete(this);
    }
}

export namespace Node {
    export interface NodeOptions extends Endpoint.EndpointOptions {
        environment?: Environment;
    }

    export type Options<T extends Node.CommonRootEndpoint = Node.CommonRootEndpoint> = Endpoint.Options<T, NodeOptions>;

    export type Configuration<T extends Node.CommonRootEndpoint = Node.CommonRootEndpoint> = Endpoint.Configuration<
        T,
        NodeOptions
    >;

    export function nodeConfigFor<T extends RootEndpoint>(
        defaultType: T,
        configuration: undefined | T | Configuration<T>,
        options?: Options<T>,
    ): Node.Configuration<T> {
        if (!options) {
            options = {};
        }
        if (configuration === undefined) {
            return {
                type: defaultType,
                ...options,
            };
        }
        if ((configuration as EndpointType).deviceType !== undefined) {
            return {
                type: configuration as T,
                ...options,
            };
        }
        return {
            type: defaultType,
            ...configuration,
        } as Endpoint.Configuration<T>;
    }

    /**
     * Common root endpoint definition for all nodes.
     */
    export const CommonRootEndpoint = MutableEndpoint({
        name: RootEndpoint.name,
        deviceType: RootEndpoint.deviceType,
        deviceRevision: RootEndpoint.deviceRevision,
        deviceClass: RootEndpoint.deviceClass,
        requirements: RootEndpoint.requirements,
        behaviors: {
            parts: PartsBehavior,
            index: IndexBehavior,
        },
    });

    export interface CommonRootEndpoint extends Identity<typeof CommonRootEndpoint> {}
}
