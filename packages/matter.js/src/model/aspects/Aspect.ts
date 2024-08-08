/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDeepEqual } from "../../util/DeepEqual.js";
import { serialize } from "../../util/String.js";
import { DefinitionError } from "../definitions/DefinitionError.js";

/**
 * An "aspect" is metadata about a Matter element that affects implementation
 * behavior.  Aspects are mostly "qualities" in the Matter specification except
 * for "constraint" which is not formally described as a quality.
 */
export abstract class Aspect<D> {
    definition: D;
    declare errors?: DefinitionError[];

    get valid() {
        return !this.errors;
    }

    constructor(definition: D) {
        this.definition = definition;
    }

    get empty() {
        for (const [k, v] of Object.entries(this)) {
            if (k !== "definition" && v !== undefined) {
                return false;
            }
        }
        return true;
    }

    /**
     * Test for logical equivalence.
     */
    equals(other: any) {
        if (!(other instanceof this.constructor)) {
            return false;
        }
        return isDeepEqual(this.valueOf(), other.valueOf());
    }

    valueOf() {
        return this.toString();
    }

    // Ensure derivatives implement toString()
    abstract toString(): string;

    error(code: string, message: string) {
        if (!this.errors) {
            this.errors = [];
        }
        this.errors.push({
            code,
            source: `${this.constructor.name} ${serialize(this.definition)}`,
            message,
        });
    }

    extend<This extends Aspect<any>>(this: This, other: Exclude<D, "string">) {
        const descriptors = [
            ...Object.entries(Object.getOwnPropertyDescriptors(this)),
            ...Object.entries(Object.getOwnPropertyDescriptors(other)),
        ];

        const definition = {} as { [name: string]: any };
        for (const [name, descriptor] of descriptors) {
            if (name === "definition" || name === "errors" || descriptor.value === undefined) {
                continue;
            }
            definition[name] = descriptor.value;
        }

        const constructor = this.constructor as new (definition: any) => Aspect<D>;
        return new constructor(definition) as This;
    }
}
