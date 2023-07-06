import { ClassType, Notores, PrimitiveNonArrayType } from "../types/Notores";
import { OpenAPIV3 } from "openapi-types";
export declare function generateRefPath(ref: ClassType): string;
export declare function generateRefObject(ref: ClassType): {
    $ref: string;
};
export declare function isArraySchemaObject(input: any): input is OpenAPIV3.ArraySchemaObject;
export declare function isNonArraySchemaObjectType(input: any): input is OpenAPIV3.NonArraySchemaObjectType;
export declare function isPrimitiveNonArrayType(input: any): input is PrimitiveNonArrayType;
export declare function isSwagPropRefOptions(input: any): input is Notores.SwagPropRefOptions;
export declare function isReferenceObject(input: any): input is OpenAPIV3.ReferenceObject;
export declare function isResponseObject(input: any): input is OpenAPIV3.ResponseObject;
