import { describe, it, expect } from "vitest";
import schema from "../../checklist.linkml.schema.json";
import checklistEntries from "../../checklist.data.json";
import { VERSION, DATA } from "../../checklist.js";

function validateValue(value, range, schema, path) {
    if (schema.enums?.[range]) {
        const validValues = new Set(Object.keys(schema.enums[range].permissible_values || {}));
        if (!validValues.has(value)) {
            throw new Error(`${path} must be one of: ${Array.from(validValues).join(", ")}`);
        }
        return;
    }

    if (range === "string") {
        if (typeof value !== "string") {
            throw new Error(`${path} must be a string`);
        }
        return;
    }

    const targetClass = schema.classes?.[range];
    if (!targetClass) {
        throw new Error(`Unsupported range ${range} at ${path}`);
    }

    validateObject(value, targetClass, schema, path);
}

function validateObject(value, classDef, schema, path) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error(`${path} must be an object`);
    }

    const attributes = classDef.attributes || {};
    for (const [attrName, attrDef] of Object.entries(attributes)) {
        const hasValue = Object.prototype.hasOwnProperty.call(value, attrName);
        if (attrDef.required && !hasValue) {
            throw new Error(`${path}.${attrName} is required`);
        }
        if (!hasValue) continue;

        const attrValue = value[attrName];
        if (attrDef.multivalued) {
            if (!Array.isArray(attrValue) || attrValue.length === 0) {
                throw new Error(`${path}.${attrName} must be a non-empty array`);
            }
            attrValue.forEach((entry, index) => {
                validateValue(entry, attrDef.range || schema.default_range, schema, `${path}.${attrName}[${index}]`);
            });
        } else {
            validateValue(attrValue, attrDef.range || schema.default_range, schema, `${path}.${attrName}`);
        }
    }
}

describe("LinkML checklist schema", () => {
    it("keeps checklist.js DATA sourced from checklist.data.json", () => {
        expect(DATA).toEqual(checklistEntries);
    });

    it("validates checklist payload against LinkML schema", () => {
        const payload = {
            version: VERSION,
            entries: checklistEntries,
        };

        const rootClassName = Object.entries(schema.classes).find(([, def]) => def.tree_root)?.[0];
        expect(rootClassName).toBe("Checklist");

        validateObject(payload, schema.classes[rootClassName], schema, rootClassName);
    });
});
