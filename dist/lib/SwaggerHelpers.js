"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isResponseObject = exports.isReferenceObject = exports.isSwagPropRefOptions = exports.isPrimitiveNonArrayType = exports.isNonArraySchemaObjectType = exports.isArraySchemaObject = exports.generateRefObject = exports.generateRefPath = void 0;
const classHelpers_1 = require("./classHelpers");
function generateRefPath(ref) {
    return `#/components/schemas/${ref.name}`;
}
exports.generateRefPath = generateRefPath;
function generateRefObject(ref) {
    return { $ref: generateRefPath(ref) };
}
exports.generateRefObject = generateRefObject;
function isArraySchemaObject(input) {
    return input.hasOwnProperty('type') &&
        input.type === 'array' &&
        input.hasOwnProperty('items');
}
exports.isArraySchemaObject = isArraySchemaObject;
function isNonArraySchemaObjectType(input) {
    return ['boolean', 'object', 'number', 'string', 'integer'].includes(typeof input);
}
exports.isNonArraySchemaObjectType = isNonArraySchemaObjectType;
function isPrimitiveNonArrayType(input) {
    if (typeof input === 'function') {
        return [String, Boolean, Number].includes(input);
    }
    return ['boolean', 'number', 'string', 'integer'].includes(typeof input);
}
exports.isPrimitiveNonArrayType = isPrimitiveNonArrayType;
function isSwagPropRefOptions(input) {
    return input.hasOwnProperty('type') && (0, classHelpers_1.isClassType)(input.type);
}
exports.isSwagPropRefOptions = isSwagPropRefOptions;
function isReferenceObject(input) {
    return input.hasOwnProperty('$ref');
}
exports.isReferenceObject = isReferenceObject;
function isResponseObject(input) {
    return input.hasOwnProperty('description');
}
exports.isResponseObject = isResponseObject;
