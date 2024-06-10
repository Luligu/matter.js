/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mei } from "../../datatype/ManufacturerExtensibleIdentifier.js";
import { Quality } from "../aspects/Quality.js";
import { ElementTag, FeatureSet } from "../definitions/index.js";
import { AttributeElement } from "./AttributeElement.js";
import { BaseElement } from "./BaseElement.js";
import { CommandElement } from "./CommandElement.js";
import { DatatypeElement } from "./DatatypeElement.js";
import { EventElement } from "./EventElement.js";
import { FieldElement } from "./FieldElement.js";

/**
 * A cluster describes a set of related functionality.
 */
export interface ClusterElement extends BaseElement {
    id?: Mei;

    tag: `${ClusterElement.Tag}`;

    /**
     * The cluster's PICS code.
     */
    pics?: string;

    /**
     * Other qualities.
     *
     * Quality flags allowed for clusters are "I" (singleton) and "K" (diagnostics).  The spec as of 1.3 does not appear
     * to use the singleton flag, however.
     */
    quality?: Quality.Definition;

    /**
     * Encodes both classification and scope from the Matter specification.
     */
    classification?: `${ClusterElement.Classification}`;

    /**
     * Optional supported features.  This is for clusters used operationally
     * and is not present in the static data model.
     */
    supportedFeatures?: FeatureSet;

    children?: ClusterElement.Child[];
}

export function ClusterElement(definition: ClusterElement.Properties) {
    if (definition.quality === "") {
        delete definition.quality;
    }

    return BaseElement(ClusterElement.Tag, definition) as ClusterElement;
}

export namespace ClusterElement {
    export type Tag = ElementTag.Cluster;
    export const Tag = ElementTag.Cluster;
    export type Properties = BaseElement.Properties<ClusterElement>;
    export type Child = DatatypeElement | AttributeElement | CommandElement | EventElement | FieldElement;

    export enum Classification {
        EndpointUtility = "endpoint",
        NodeUtility = "node",
        Application = "application",
    }
}
