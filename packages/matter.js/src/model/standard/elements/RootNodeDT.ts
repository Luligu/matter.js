/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";
import {
    DeviceTypeElement as DeviceType,
    RequirementElement as Requirement,
    FieldElement as Field
} from "../../elements/index.js";

export const RootNodeDt = DeviceType({
    name: "RootNode", id: 0x16, classification: "node",

    details: "This defines conformance for a root node endpoint (see System Model specification). This endpoint " +
        "is akin to a \"read me first\" endpoint that describes itself and the other endpoints that make up " +
        "the node." +
        "\n" +
        "  • Device types with Endpoint scope shall NOT be supported on the same endpoint as this device " +
        "    type." +
        "\n" +
        "  • Clusters with an Application role shall NOT be supported on the same endpoint as this device " +
        "    type." +
        "\n" +
        "  • Other device types with Node scope may be supported on the same endpoint as this device type.",

    xref: { document: "device", section: "2.1" },

    children: [
        Requirement({
            name: "Descriptor", id: 0x1d, element: "serverCluster",
            children: [
                Requirement({ name: "DeviceTypeList", default: [ { deviceType: 22, revision: 2 } ], element: "attribute" })
            ]
        }),

        Requirement({
            name: "BasicInformation", id: 0x28, conformance: "M", element: "serverCluster", quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "AccessControl", id: 0x1f, conformance: "M", element: "serverCluster", quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "PowerSourceConfiguration", id: 0x2e, conformance: "O, D", element: "serverCluster",
            quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "TimeSynchronization", id: 0x38, conformance: "O", element: "serverCluster", quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "GroupKeyManagement", id: 0x3f, conformance: "M", element: "serverCluster", quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "GeneralCommissioning", id: 0x30, conformance: "M", element: "serverCluster", quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "NetworkCommissioning", id: 0x31, conformance: "!CustomNetworkConfig",
            element: "serverCluster",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "AdministratorCommissioning", id: 0x3c, conformance: "M", element: "serverCluster",
            quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "OperationalCredentials", id: 0x3e, conformance: "M", element: "serverCluster", quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "LocalizationConfiguration", id: 0x2b, conformance: "LanguageLocale",
            element: "serverCluster", quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "TimeFormatLocalization", id: 0x2c, conformance: "TimeLocale", element: "serverCluster",
            quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "UnitLocalization", id: 0x2d, conformance: "UnitLocale", element: "serverCluster",
            quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "GeneralDiagnostics", id: 0x33, conformance: "M", element: "serverCluster", quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "DiagnosticLogs", id: 0x32, conformance: "O", element: "serverCluster", quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "SoftwareDiagnostics", id: 0x34, conformance: "O", element: "serverCluster", quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "EthernetNetworkDiagnostics", id: 0x37, conformance: "[Ethernet]", element: "serverCluster",
            quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "WiFiNetworkDiagnostics", id: 0x36, conformance: "[Wi, 0, i]", element: "serverCluster",
            quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "ThreadNetworkDiagnostics", id: 0x35, conformance: "[Thread]", element: "serverCluster",
            quality: "I",
            xref: { document: "device", section: "2.1.5" }
        }),
        Requirement({
            name: "IcdManagement", id: 0x46, conformance: "SIT", element: "serverCluster", quality: "I",
            xref: { document: "device", section: "2.1.5" },
            children: [Requirement({ name: "LONGIDLETIMESUPPORT", conformance: "P, LIT", element: "feature" })]
        }),

        Field({
            name: "conditions", type: "enum8",
            children: [Field({
                name: "CustomNetworkConfig",
                description: "The node only supports out-of-band-configured networking (e.g. rich user interface, manufacturer-specific means, custom commissioning flows, or future IP-compliant network technology not yet directly supported by NetworkCommissioning cluster).",
                xref: { document: "device", section: "2.1.3" }
            })]
        })
    ]
});

Matter.children.push(RootNodeDt);
