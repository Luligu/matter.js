/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MicrowaveOvenMode } from "../../../cluster/definitions/MicrowaveOvenModeCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";
import { MicrowaveOvenModeInterface } from "./MicrowaveOvenModeInterface.js";

/**
 * MicrowaveOvenModeBehavior is the base class for objects that support interaction with {@link
 * MicrowaveOvenMode.Cluster}.
 */
export const MicrowaveOvenModeBehavior = ClusterBehavior
    .withInterface<MicrowaveOvenModeInterface>()
    .for(MicrowaveOvenMode.Cluster);

type MicrowaveOvenModeBehaviorType = InstanceType<typeof MicrowaveOvenModeBehavior>;
export interface MicrowaveOvenModeBehavior extends MicrowaveOvenModeBehaviorType {}
type StateType = InstanceType<typeof MicrowaveOvenModeBehavior.State>;
export namespace MicrowaveOvenModeBehavior { export interface State extends StateType {} }
