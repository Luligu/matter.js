/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MutableCluster } from "../mutation/MutableCluster.js";
import {
    WritableAttribute,
    FixedAttribute,
    Attribute,
    OptionalWritableAttribute,
    Command,
    TlvNoResponse
} from "../Cluster.js";
import { TlvUInt8 } from "../../tlv/TlvNumber.js";
import { TlvNullable } from "../../tlv/TlvNullable.js";
import { BitFlag } from "../../schema/BitmapSchema.js";
import { TlvArray } from "../../tlv/TlvArray.js";
import { ModeBase } from "./ModeBaseCluster.js";
import { Identity } from "@project-chip/matter.js-general";
import { ClusterRegistry } from "../ClusterRegistry.js";

export namespace DeviceEnergyManagementMode {
    /**
     * These are optional features supported by DeviceEnergyManagementModeCluster.
     *
     * @see {@link MatterSpecification.v13.Cluster} § 1.10.4
     */
    export enum Feature {
        /**
         * OnOff (DEPONOFF)
         *
         * This feature creates a dependency between an OnOff cluster instance and this cluster instance on the same
         * endpoint. See OnMode for more information.
         *
         * @see {@link MatterSpecification.v13.Cluster} § 1.10.4.1
         */
        OnOff = "OnOff"
    }

    export enum ModeTag {
        /**
         * The device prohibits optimization of energy usage management: its energy usage is determined only by the
         * user configuration and internal device needs. This tag cannot be included with any of the other tags defined
         * below in a mode.
         *
         * @see {@link MatterSpecification.v13.Cluster} § 9.6.5.1.1
         */
        NoOptimization = 16384,

        /**
         * The device is permitted to manage its own energy usage. For example, using tariff information it may obtain.
         *
         * @see {@link MatterSpecification.v13.Cluster} § 9.6.5.1.2
         */
        DeviceOptimization = 16385,

        /**
         * The device permits management of energy usage by an energy manager to optimize the local energy usage.
         *
         * @see {@link MatterSpecification.v13.Cluster} § 9.6.5.1.3
         */
        LocalOptimization = 16386,

        /**
         * The device permits management of energy usage by an energy manager to optimize the grid energy usage.
         *
         * @see {@link MatterSpecification.v13.Cluster} § 9.6.5.1.4
         */
        GridOptimization = 16387
    }

    /**
     * A DeviceEnergyManagementModeCluster supports these elements if it supports feature OnOff.
     */
    export const OnOffComponent = MutableCluster.Component({
        attributes: {
            /**
             * Indicates whether the value of CurrentMode depends on the state of the On/Off cluster on the same
             * endpoint. If this attribute is not present or is set to null, there is no dependency, otherwise the
             * CurrentMode attribute shall depend on the OnOff attribute in the On/Off cluster
             *
             * The value of this field shall match the Mode field of one of the entries in the SupportedModes attribute.
             *
             * @see {@link MatterSpecification.v13.Cluster} § 1.10.6.5
             */
            onMode: WritableAttribute(0x3, TlvNullable(TlvUInt8), { persistent: true, default: null })
        }
    });

    /**
     * These elements and properties are present in all DeviceEnergyManagementMode clusters.
     */
    export const Base = MutableCluster.Component({
        id: 0x9f,
        name: "DeviceEnergyManagementMode",
        revision: 1,

        features: {
            /**
             * OnOff
             *
             * This feature creates a dependency between an OnOff cluster instance and this cluster instance on the
             * same endpoint. See OnMode for more information.
             *
             * @see {@link MatterSpecification.v13.Cluster} § 1.10.4.1
             */
            onOff: BitFlag(0)
        },

        attributes: {
            /**
             * This attribute shall contain the list of supported modes that may be selected for the CurrentMode
             * attribute. Each item in this list represents a unique mode as indicated by the Mode field of the
             * ModeOptionStruct.
             *
             * Each entry in this list shall have a unique value for the Mode field. Each entry in this list shall have
             * a unique value for the Label field.
             *
             * @see {@link MatterSpecification.v13.Cluster} § 1.10.6.2
             */
            supportedModes: FixedAttribute(0x0, TlvArray(ModeBase.TlvModeOption, { minLength: 2, maxLength: 255 })),

            /**
             * Indicates the current mode of the server.
             *
             * The value of this field shall match the Mode field of one of the entries in the SupportedModes attribute.
             *
             * The value of this attribute may change at any time via an out-of-band interaction outside of the server,
             * such as interactions with a user interface, via internal mode changes due to autonomously progressing
             * through a sequence of operations, on system time-outs or idle delays, or via interactions coming from a
             * fabric other than the one which last executed a ChangeToMode.
             *
             * @see {@link MatterSpecification.v13.Cluster} § 1.10.6.3
             */
            currentMode: Attribute(0x1, TlvUInt8, { scene: true, persistent: true }),

            /**
             * Indicates the desired startup mode for the server when it is supplied with power.
             *
             * If this attribute is not null, the CurrentMode attribute shall be set to the StartUpMode value, when the
             * server is powered up, except in the case when the OnMode attribute overrides the StartUpMode attribute
             * (see OnModeWithPowerUp).
             *
             * This behavior does not apply to reboots associated with OTA. After an OTA restart, the CurrentMode
             * attribute shall return to its value prior to the restart.
             *
             * The value of this field shall match the Mode field of one of the entries in the SupportedModes attribute.
             *
             * If this attribute is not implemented, or is set to the null value, it shall have no effect.
             *
             * @see {@link MatterSpecification.v13.Cluster} § 1.10.6.4
             */
            startUpMode: OptionalWritableAttribute(0x2, TlvNullable(TlvUInt8), { persistent: true })
        },

        commands: {
            /**
             * This command is used to change device modes.
             *
             * On receipt of this command the device shall respond with a ChangeToModeResponse command.
             *
             * @see {@link MatterSpecification.v13.Cluster} § 1.10.7.1
             */
            changeToMode: Command(0x0, ModeBase.TlvChangeToModeRequest, 0x0, TlvNoResponse)
        },

        /**
         * This metadata controls which DeviceEnergyManagementModeCluster elements matter.js activates for specific
         * feature combinations.
         */
        extensions: MutableCluster.Extensions({ flags: { onOff: true }, component: OnOffComponent })
    });

    /**
     * @see {@link Cluster}
     */
    export const ClusterInstance = MutableCluster(Base);

    /**
     * This cluster is derived from the Mode Base cluster, defining additional mode tags and namespaced enumerated
     * values for Device Energy Management devices.
     *
     * NOTE Support for Device Energy Management Mode cluster is provisional.
     *
     * DeviceEnergyManagementModeCluster supports optional features that you can enable with the
     * DeviceEnergyManagementModeCluster.with() factory method.
     *
     * @see {@link MatterSpecification.v13.Cluster} § 9.6
     */
    export interface Cluster extends Identity<typeof ClusterInstance> {}

    export const Cluster: Cluster = ClusterInstance;
    const DEPONOFF = { onOff: true };

    /**
     * @see {@link Complete}
     */
    export const CompleteInstance = MutableCluster({
        id: Cluster.id,
        name: Cluster.name,
        revision: Cluster.revision,
        features: Cluster.features,
        attributes: {
            ...Cluster.attributes,
            onMode: MutableCluster.AsConditional(OnOffComponent.attributes.onMode, { mandatoryIf: [DEPONOFF] })
        },
        commands: Cluster.commands
    });

    /**
     * This cluster supports all DeviceEnergyManagementMode features. It may support illegal feature combinations.
     *
     * If you use this cluster you must manually specify which features are active and ensure the set of active
     * features is legal per the Matter specification.
     */
    export interface Complete extends Identity<typeof CompleteInstance> {}

    export const Complete: Complete = CompleteInstance;
}

export type DeviceEnergyManagementModeCluster = DeviceEnergyManagementMode.Cluster;
export const DeviceEnergyManagementModeCluster = DeviceEnergyManagementMode.Cluster;
ClusterRegistry.register(DeviceEnergyManagementMode.Complete);
