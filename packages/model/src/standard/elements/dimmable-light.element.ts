/**
 * @license
 * Copyright 2022-2025 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MatterDefinition } from "../MatterDefinition.js";
import { DeviceTypeElement as DeviceType, RequirementElement as Requirement } from "../../elements/index.js";

export const DimmableLightDt = DeviceType(
    { name: "DimmableLight", id: 0x101, type: "OnOffLight" },
    Requirement(
        { name: "Descriptor", id: 0x1d, element: "serverCluster" },
        Requirement({ name: "DeviceTypeList", default: [ { deviceType: 257, revision: 3 } ], element: "attribute" })
    ),
    Requirement(
        { name: "Identify", id: 0x3, conformance: "M", element: "serverCluster" },
        Requirement({ name: "TriggerEffect", conformance: "M", element: "command" })
    ),
    Requirement({ name: "Groups", id: 0x4, conformance: "M", element: "serverCluster" }),
    Requirement(
        { name: "ScenesManagement", id: 0x62, conformance: "P, M", element: "serverCluster" },
        Requirement({ name: "CopyScene", conformance: "P, M", element: "command" })
    ),
    Requirement(
        { name: "OnOff", id: 0x6, conformance: "M", element: "serverCluster" },
        Requirement({ name: "LIGHTING", conformance: "M", element: "feature" })
    ),

    Requirement(
        { name: "LevelControl", id: 0x8, conformance: "M", element: "serverCluster" },
        Requirement({ name: "LIGHTING", conformance: "M", element: "feature" }),
        Requirement({ name: "ONOFF", conformance: "M", element: "feature" }),
        Requirement({ name: "CurrentLevel", constraint: "1 to 254", element: "attribute" }),
        Requirement({ name: "MinLevel", constraint: "1", element: "attribute" }),
        Requirement({ name: "MaxLevel", constraint: "254", element: "attribute" })
    ),

    Requirement({ name: "OccupancySensing", id: 0x406, conformance: "O", element: "clientCluster" })
);

MatterDefinition.children.push(DimmableLightDt);
