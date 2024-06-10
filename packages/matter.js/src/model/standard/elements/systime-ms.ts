/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";
import { DatatypeElement as Datatype } from "../../elements/index.js";

export const systimeMs = Datatype({
    name: "systime-ms", type: "uint64", description: "System Time in milliseconds", isSeed: true,
    details: "System time in milliseconds is an unsigned 64-bit value representing the number of milliseconds " +
        "since boot." +
        "\n" +
        "This type is employed for compatibility reasons.",
    xref: { document: "core", section: "7.18.2.9" }
});

Matter.children.push(systimeMs);
