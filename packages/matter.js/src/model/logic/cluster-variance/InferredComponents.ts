/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotImplementedError } from "../../../common/MatterError.js";
import { isDeepEqual } from "../../../util/DeepEqual.js";
import { AttributeModel, ClusterModel, ValueModel } from "../../models/index.js";
import { VarianceCondition } from "./VarianceCondition.js";

/**
 * Lists mandatory and optional elements for a specific context.
 */
export type InferredComponent = {
    mandatory: ValueModel[];
    optional: ValueModel[];
    condition?: VarianceCondition;
};

/**
 * A list of component definitions.
 */
export type InferredComponents = InferredComponent[];

/**
 * Details components generated by analyzing variance of cluster elements.
 */
export function InferredComponents(cluster: ClusterModel): InferredComponents {
    const result = [] as InferredComponents;
    cluster.allAces.forEach(child => addElement(result, child));
    return result;
}

type VarianceMatcher = {
    pattern: RegExp;
    processor: (add: (optional?: boolean, condition?: VarianceCondition) => void, match: string[]) => void;
};

function pattern(...parts: string[]) {
    parts = parts.map(p => {
        switch (p) {
            case "[":
            case "]":
            case "(":
            case ")":
                return `\\${p}`;

            default:
                return p;
        }
    });
    return new RegExp(`^${parts.join("")}$`);
}

const FEATURE_NAME = "[A-Z_][A-Z_0-9]+";
const FEATURE = `(${FEATURE_NAME})`;
const CONJUNCT_FEATURES = `(${FEATURE_NAME}(?: & ${FEATURE_NAME})*)`;
const DISJUNCT_FEATURES = CONJUNCT_FEATURES.replace(/&/g, "[|,]");
const FIELD = "[A-Z][A-Za-z_$]*[a-z][A-Za-z_$]*";
const CONJUNCT_FIELDS = `(${FIELD}(?: & ${FIELD})*)`;
const DISJUNCT_FIELDS = CONJUNCT_FIELDS.replace(/&/g, "[|,]");
const AND = " & ";
const NOT = "!";

function splitConjunction(conjunction: string) {
    return conjunction.split(" & ");
}

function splitDisjunction(disjunction: string) {
    return disjunction.split(" | ");
}

/**
 * We use a rules-based approach to infer cluster variance.  The goal is to classify into as few sets as possible.  This
 * leads to fewer duplicated elements and reduced complexity of generated clusters.
 *
 * Matches string form rather than the AST because that is also simpler for the moment.  This is less fragile than it
 * may appear because string is normalized product of parser -> AST -> serializer.
 *
 * Note also that this only applies to conformance of cluster-level elements. There is considerably more variance in
 * field-level conformance but we handle that with the record validator which supports the entire dialect.
 */
const VarianceMatchers: VarianceMatcher[] = [
    // Mandatory, unconditional
    {
        pattern: pattern("(?:|M)"),
        processor(add) {
            add();
        },
    },

    // Optional, unconditional
    {
        pattern: pattern("(?:O|desc)"),
        processor(add) {
            add(true);
        },
    },

    // fieldName (optional, unconditional).  Ignores field reference which can only be enforced at runtime
    {
        pattern: pattern(FIELD),
        processor(add) {
            add(true);
        },
    },

    // fieldName > num (optional, unconditional).  Ignores field expression
    {
        pattern: pattern(FIELD, " > ", "\\d+"),
        processor(add) {
            add(true);
        },
    },

    // fieldName, O (optional, unconditional).  Ignores field reference
    {
        pattern: pattern(FIELD, ", ", "O"),
        processor(add) {
            add(true);
        },
    },

    // FOO & fieldName (field ignored as must be runtime enforced)
    {
        pattern: pattern(FEATURE, AND, FIELD),
        processor(add, match) {
            add(true, { allOf: match });
        },
    },

    // FOO<& BAR>*
    {
        pattern: pattern(CONJUNCT_FEATURES),
        processor(add, match) {
            add(false, { allOf: splitConjunction(match[0]) });
        },
    },

    // [FOO<& BAR>*]
    {
        pattern: pattern("[", CONJUNCT_FEATURES, "]"),
        processor(add, match) {
            add(true, { allOf: splitConjunction(match[0]) });
        },
    },

    // [FOO<| BAR>+]
    {
        pattern: pattern("[", DISJUNCT_FEATURES, "]"),
        processor(add, match) {
            add(true, { anyOf: splitDisjunction(match[0]) });
        },
    },

    // FOO<| BAR>* or FOO<, BAR>*
    {
        pattern: pattern(DISJUNCT_FEATURES),
        processor(add, match) {
            add(false, { anyOf: splitDisjunction(match[0]) });
        },
    },

    // Field<| Field>* or Field<, Field>* (optional, unconditional).  Ignores field references
    {
        pattern: pattern(DISJUNCT_FIELDS),
        processor(add) {
            add(true);
        },
    },

    // FOO, [BAR]
    {
        pattern: pattern(FEATURE, ", ", "[", FEATURE, "]"),
        processor(add, match) {
            // Must add to two sets because optionality differs
            add(false, { allOf: [match[0]] });
            add(true, { allOf: [match[1]] });
        },
    },

    // !FOO & BAR
    {
        pattern: pattern(NOT, FEATURE, AND, FEATURE),
        processor(add, match) {
            add(false, { allOf: [match[1]], not: match[0] });
        },
    },

    // !FOO & [BAR]
    {
        pattern: pattern(NOT, FEATURE, AND, "[", FEATURE, "]"),
        processor(add, match) {
            add(true, { allOf: [match[1]], not: match[0] });
        },
    },

    // !FOO & (BAR<| BIZ>*)
    {
        pattern: pattern(NOT, FEATURE, AND, "(", DISJUNCT_FEATURES, ")"),
        processor(add, match) {
            add(true, { allOf: splitDisjunction(match[1]), not: match[0] });
        },
    },

    // !FOO
    {
        pattern: pattern(NOT, FEATURE),
        processor(add, match) {
            add(false, { not: match[0] });
        },
    },

    // [!FOO]
    {
        pattern: pattern("[", NOT, FEATURE, "]"),
        processor(add, match) {
            add(true, { not: match[0] });
        },
    },

    // [!FOO & BAR]
    {
        pattern: pattern("[", NOT, FEATURE, AND, FEATURE, "]"),
        processor(add, match) {
            add(true, { not: match[0], allOf: [match[1]] });
        },
    },

    // FOO & BAR, [BIZ]
    {
        pattern: pattern(FEATURE, AND, FEATURE, ", ", "[", FEATURE, "]"),
        processor(add, match) {
            add(false, { allOf: match.slice(0, 2) });
            add(true, { allOf: [match[2]] });
        },
    },

    // FOO, O
    {
        pattern: pattern(FEATURE, ", ", "O"),
        processor(add, match) {
            add(false, { allOf: [match[0]] });
            add(true);
        },
    },
];

function addElement(components: InferredComponents, element: ValueModel) {
    if (AttributeModel.isGlobal(element)) {
        return;
    }

    let text = element.conformance.toString();

    if (text === "X") {
        return;
    }

    while (true) {
        if (text.match(/^[DP], /)) {
            text = text.substring(3);
        } else {
            break;
        }
    }

    if (text === "D") {
        text = "O";
    } else if (text === "P") {
        text = "M";
    }

    for (const matcher of VarianceMatchers) {
        const match = text.match(matcher.pattern);
        if (match) {
            matcher.processor((optional, condition) => {
                addVariance(components, element, optional, condition);
            }, match.slice(1));
            return;
        }
    }
    throw new NotImplementedError(`New rule needed for conformance "${element.conformance}" (element ${element.path})`);
}

function addVariance(
    components: InferredComponents,
    element: ValueModel,
    optional?: boolean,
    condition?: VarianceCondition,
) {
    let into: InferredComponent | undefined;

    // Find set
    for (const existing of components) {
        if (isDeepEqual(existing.condition, condition)) {
            into = existing;
            break;
        }
    }

    // If set does not exist, create it
    if (!into) {
        into = {
            condition,
            optional: [],
            mandatory: [],
        };
        if (condition) {
            components.push(into);
        } else {
            // Unconditional elements should always be detailed first
            components.unshift(into);
        }
    }

    // Add the element to the set
    if (optional) {
        into.optional.push(element);
    } else {
        into.mandatory.push(element);
    }
}
