import { isClassType } from "./classHelpers";
export function generateRefPath(ref) {
    return `#/components/schemas/${ref.name}`;
}
export function generateRefObject(ref) {
    return { $ref: generateRefPath(ref) };
}
export function isArraySchemaObject(input) {
    return input.hasOwnProperty('type') &&
        input.type === 'array' &&
        input.hasOwnProperty('items');
}
export function isNonArraySchemaObjectType(input) {
    return ['boolean', 'object', 'number', 'string', 'integer'].includes(typeof input);
}
export function isPrimitiveNonArrayType(input) {
    if (typeof input === 'function') {
        return [String, Boolean, Number].includes(input);
    }
    return ['boolean', 'number', 'string', 'integer'].includes(typeof input);
}
export function isSwagPropRefOptions(input) {
    return input.hasOwnProperty('type') && isClassType(input.type);
}
export function isReferenceObject(input) {
    return input.hasOwnProperty('$ref');
}
export function isResponseObject(input) {
    return input.hasOwnProperty('description');
}
