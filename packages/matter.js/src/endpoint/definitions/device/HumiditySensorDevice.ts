/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { IdentifyServer as BaseIdentifyServer } from "../../../behavior/definitions/identify/IdentifyServer.js";
import {
    RelativeHumidityMeasurementServer as BaseRelativeHumidityMeasurementServer
} from "../../../behavior/definitions/relative-humidity-measurement/RelativeHumidityMeasurementServer.js";
import { MutableEndpoint } from "../../type/MutableEndpoint.js";
import { SupportedBehaviors } from "../../properties/SupportedBehaviors.js";
import { Identity } from "../../../util/Type.js";

/**
 * A humidity sensor (in most cases a Relative humidity sensor) reports humidity measurements.
 *
 * @see {@link MatterSpecification.v13.Device} § 7.7
 */
export interface HumiditySensorDevice extends Identity<typeof HumiditySensorDeviceDefinition> {}

export namespace HumiditySensorRequirements {
    /**
     * The Identify cluster is required by the Matter specification
     *
     * We provide this alias to the default implementation {@link IdentifyServer} for convenience.
     */
    export const IdentifyServer = BaseIdentifyServer;

    /**
     * The RelativeHumidityMeasurement cluster is required by the Matter specification
     *
     * We provide this alias to the default implementation {@link RelativeHumidityMeasurementServer} for convenience.
     */
    export const RelativeHumidityMeasurementServer = BaseRelativeHumidityMeasurementServer;

    /**
     * An implementation for each server cluster supported by the endpoint per the Matter specification.
     */
    export const server = {
        mandatory: { Identify: IdentifyServer, RelativeHumidityMeasurement: RelativeHumidityMeasurementServer }
    };
}

export const HumiditySensorDeviceDefinition = MutableEndpoint({
    name: "HumiditySensor",
    deviceType: 0x307,
    deviceRevision: 2,
    requirements: HumiditySensorRequirements,
    behaviors: SupportedBehaviors(
        HumiditySensorRequirements.server.mandatory.Identify,
        HumiditySensorRequirements.server.mandatory.RelativeHumidityMeasurement
    )
});

export const HumiditySensorDevice: HumiditySensorDevice = HumiditySensorDeviceDefinition;
