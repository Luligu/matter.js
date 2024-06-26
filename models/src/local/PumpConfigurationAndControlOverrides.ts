/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LocalMatter } from "../local.js";

LocalMatter.children.push({
    tag: "cluster",
    name: "PumpConfigurationAndControl",

    children: [
        // The spec only defines long-form names for these bits in a non-standard table we don't bother parsing because
        // it contains nothing else useful.
        //
        // This attribute is actually marked as Zigbee-only so we treat as deprecated.  So we may not even need these
        {
            tag: "attribute",
            id: 0x1d,
            name: "AlarmMask",
            children: [
                {
                    tag: "field",
                    constraint: "0",
                    name: "InitializationFailure",
                    details: "The device failed to complete initialization at powerup",
                },
                {
                    tag: "field",
                    constraint: "1",
                    name: "HardwareFailure",
                    details: "The device has detected a hardware fault",
                },
                {
                    tag: "field",
                    constraint: "2",
                    name: "SelfCalibrationFailure",
                    details: "The device was unable to complete self calibration",
                },
            ],
        },
    ],
});
