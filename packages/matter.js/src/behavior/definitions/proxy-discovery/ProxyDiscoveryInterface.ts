/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MaybePromise } from "@project-chip/matter.js-general";
import { ProxyDiscovery } from "../../../cluster/definitions/ProxyDiscoveryCluster.js";

export namespace ProxyDiscoveryInterface {
    export interface Base {
        /**
         * This command is used during proxy discovery, as specified in Section 9.15.7, “Proxy Discovery & Assignment
         * Flow”.
         *
         * @see {@link MatterSpecification.v13.Core} § 9.15.12.4.1
         */
        proxyDiscoverRequest(request: ProxyDiscovery.ProxyDiscoverRequest): MaybePromise;
    }
}

export type ProxyDiscoveryInterface = { components: [{ flags: {}, methods: ProxyDiscoveryInterface.Base }] };
