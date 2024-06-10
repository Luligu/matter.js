/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";
import { DatatypeElement as Datatype } from "../../elements/index.js";

export const groupId = Datatype({
    name: "group-id", type: "uint16", description: "Group ID", isSeed: true,
    details: "A 16-bit ID for a group scoped to a particular fabric as indicated by an accompanying fabric index " +
        "adjacent instantiation.",
    xref: { document: "core", section: "7.18.2.22" }
});

Matter.children.push(groupId);
