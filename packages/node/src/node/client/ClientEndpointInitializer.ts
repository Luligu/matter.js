/**
 * @license
 * Copyright 2022-2025 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Behavior } from "#behavior/Behavior.js";
import { ClusterBehavior } from "#behavior/cluster/ClusterBehavior.js";
import { BehaviorBacking } from "#behavior/internal/BehaviorBacking.js";
import { ClientBehaviorBacking } from "#behavior/internal/ClientBehaviorBacking.js";
import { ServerBehaviorBacking } from "#behavior/internal/ServerBehaviorBacking.js";
import { Endpoint } from "#endpoint/Endpoint.js";
import { EndpointInitializer } from "#endpoint/properties/EndpointInitializer.js";
import type { ClientNode } from "#node/ClientNode.js";
import { ClientNodeStore } from "#storage/client/ClientNodeStore.js";
import { NodeStore } from "#storage/NodeStore.js";
import { ClientStructure } from "./ClientStructure.js";

export class ClientEndpointInitializer extends EndpointInitializer {
    #node: ClientNode;
    #store: NodeStore;
    #structure?: ClientStructure;

    constructor(node: ClientNode) {
        super();
        this.#node = node;
        this.#store = node.env.get(ClientNodeStore);
    }

    async eraseDescendant(endpoint: Endpoint) {
        if (endpoint === this.#node) {
            await this.#store.erase();
            return;
        }

        if (!endpoint.lifecycle.hasId) {
            return;
        }

        const store = this.#store.storeForEndpoint(endpoint);
        await store.erase();
    }

    async deactivateDescendant(_endpoint: Endpoint) {
        // nothing to do
    }

    override createBacking(endpoint: Endpoint, type: Behavior.Type): BehaviorBacking {
        // Non-cluster behaviors are local operation the same server behaviors
        if ((type as ClusterBehavior.Type).cluster === undefined) {
            const store = this.structure.storeForLocal(endpoint, type);
            return new ServerBehaviorBacking(endpoint, type, store, endpoint.behaviors.optionsFor(type));
        }

        // Cluster behaviors are clients to a remote cluster
        const store = this.structure.storeForRemote(endpoint, type as ClusterBehavior.Type);
        return new ClientBehaviorBacking(endpoint, type, store, endpoint.behaviors.optionsFor(type));
    }

    get structure() {
        if (this.#structure === undefined) {
            this.#structure = new ClientStructure(this.#node);
        }
        return this.#structure;
    }
}
