/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";
import { DatatypeElement as Datatype } from "../../elements/index.js";

export const fabricId = Datatype({
    name: "fabric-id", type: "uint64", description: "Fabric ID", isSeed: true,
    details: "A value to identify a fabric.",
    xref: { document: "core", section: "7.18.2.19" }
});
Matter.children.push(fabricId);
