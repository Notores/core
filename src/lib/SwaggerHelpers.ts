import {ClassType, Notores, PrimitiveNonArrayType} from "../types/Notores";
import {OpenAPIV3} from "openapi-types";
import {isClassType} from "./classHelpers";

export function generateRefPath(ref: ClassType) {
    return `#/components/schemas/${ref.name}`;
}

export function generateRefObject(ref: ClassType) {
    return {$ref: generateRefPath(ref)};
}

export function isArraySchemaObject(input: any): input is OpenAPIV3.ArraySchemaObject {
    return input.hasOwnProperty('type') &&
        input.type === 'array' &&
        input.hasOwnProperty('items')
}

export function isNonArraySchemaObjectType(input: any): input is OpenAPIV3.NonArraySchemaObjectType {
    return ['boolean', 'object', 'number', 'string', 'integer'].includes(typeof input)
}

export function isPrimitiveNonArrayType(input: any): input is PrimitiveNonArrayType {
    if(typeof input === 'function') {
        return [String, Boolean, Number].includes(input);
    }

    return ['boolean', 'number', 'string', 'integer'].includes(typeof input)
}

export function isSwagPropRefOptions(input: any): input is Notores.SwagPropRefOptions {
    return input.hasOwnProperty('type') && isClassType(input.type)
}

export function isReferenceObject(input: any): input is OpenAPIV3.ReferenceObject {
    return input.hasOwnProperty('$ref');
}

export function isResponseObject(input: any): input is OpenAPIV3.ResponseObject {
    return input.hasOwnProperty('description')
}