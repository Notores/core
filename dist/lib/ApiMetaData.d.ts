import RoutingMetadata from "./RoutingMetadata";
import { ClassType, PrimitiveNonArrayType } from "../types/Notores";
import { OpenAPIV3 } from "openapi-types";
export declare enum HttpMethod {
    GET = "get",
    POST = "post",
    PATCH = "patch",
    PUT = "put",
    DELETE = "delete"
}
export declare class ApiMetaData extends RoutingMetadata {
    #private;
    static getApiMetaData(target: any, propertyKey: string): any;
    constructor(target: any, propertyKey: string);
    save(): void;
    extractPathData(target: any, propertyKey: string): void;
    setResponses(responseKey?: string | false): this;
    addDefaultResponse(responseKey?: string | false): this;
    addDefaultParameter(entity: ClassType): this;
    addPathPrefix(prefix: string): this;
    addTag(tag: string): this;
    set addId(addId: boolean);
    get addId(): boolean;
    set requestBody(requestBody: ClassType);
    get requestBody(): ClassType;
    set swaggerTags(tags: string[]);
    set swaggerSummary(summary: string);
    set swaggerDescription(description: string);
    set swaggerOperationId(operationId: string);
    addSwaggerParameter(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject): this;
    addSwaggerRequestBody(requestBody: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject): this;
    addResponseObject(statusCode: number, entity: ClassType | ClassType[], description?: string): void;
    addSwaggerResponse(statusCode: number, response: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject): this;
    addSwaggerQueryParameter(key: string, type: PrimitiveNonArrayType | Function): this;
    set swaggerDeprecated(deprecated: boolean);
    set contentType(value: string | undefined);
    set accepts(value: string[]);
    set preMiddlewares(preMiddleware: any | any[]);
    set postMiddlewares(postMiddleware: any | any[]);
    get contentType(): string | undefined;
    get accepts(): string[];
    get method(): string;
    setMethod(method: HttpMethod): void;
    get preMiddlewares(): any | any[];
    get postMiddlewares(): any | any[];
    set addSwagger(swagger: boolean);
    get addSwagger(): boolean;
    set swaggerDoc(swaggerDoc: OpenAPIV3.OperationObject);
    get swaggerDoc(): OpenAPIV3.OperationObject;
    replacePathParams(path: string): string;
    get swaggerPath(): string | RegExp;
    set swaggerPath(value: string | RegExp);
    get path(): string | RegExp;
    set path(path: string | RegExp);
}
