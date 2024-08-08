/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataModelPath } from "../../../../model/definitions/DataModelPath.js";
import { ClusterModel, Metatype, UnsupportedCastError, ValueModel } from "../../../../model/index.js";
import { camelize } from "../../../../util/String.js";
import { SchemaImplementationError } from "../../../errors.js";
import { RootSupervisor } from "../../../supervision/RootSupervisor.js";
import { Schema } from "../../../supervision/Schema.js";
import { ValueSupervisor } from "../../../supervision/ValueSupervisor.js";
import { Val } from "../../Val.js";

/**
 * Obtain a {@link ValueSupervisor.Caster} function for the given schema.
 */
export function ValueCaster(schema: Schema, owner: RootSupervisor) {
    const metatype = schema.effectiveMetatype ?? Metatype.any;

    switch (metatype) {
        case Metatype.object:
            return StructCaster(schema as ValueModel | ClusterModel, owner);

        case Metatype.array:
            return ListCaster(schema as ValueModel, owner);

        default:
            return Metatype.cast[metatype];
    }
}

function StructCaster(schema: ValueModel | ClusterModel, owner: RootSupervisor) {
    const memberConfigs = {} as Record<string, { name: string; cast: ValueSupervisor.Cast }>;
    for (const member of schema.activeMembers) {
        if (member.isDeprecated) {
            continue;
        }

        const config = { name: camelize(member.name), cast: owner.get(member).cast };

        // Correct case has priority
        memberConfigs[config.name] = config;

        // We also support case-insensitive match.  There are no collisions if names are case-insensitive in standard
        // Matter models but we differentiate anyway just for completeness
        const lowerName = member.name.toLowerCase();
        if (!memberConfigs[lowerName]) {
            memberConfigs[lowerName] = config;
        }
    }

    const castToObject = Metatype.cast.object;

    return (value: any) => {
        const input = castToObject(value);
        const output = {} as Val.Struct;

        for (const key in input) {
            let config = memberConfigs[key];
            if (config === undefined) {
                config = memberConfigs[key.toLowerCase()];
            }

            if (config === undefined) {
                throw new UnsupportedCastError(`Property "${key}" is unsupported`);
            }

            output[config.name] = config.cast(input[key]);
        }

        return output;
    };
}

function ListCaster(schema: ValueModel, owner: RootSupervisor) {
    const entry = schema.listEntry;
    if (entry === undefined) {
        throw new SchemaImplementationError(DataModelPath(schema.path), "List schema has no entry definition");
    }

    const castToArray = Metatype.cast.array;
    const castEntry = owner.get(entry).cast;

    return (value: any) => castToArray(value).map(castEntry);
}
