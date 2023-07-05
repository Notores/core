import {OpenAPIV3} from "openapi-types";
import {apiMetadataKey} from "../symbols";
import {SystemLogger} from "../Notores";
import {
    ApiMetaData, capitalizeFirstLetter, generateRefObject,
    HttpMethod,
    isResponseObject,
    logErrorApiMetaDataDoesNotExist,
    logWarningIfNoAuthentication
} from "../lib";
import {ApiPath, ClassType, CombinedPathOptions, PathOptions, TargetReturnType} from "../types/Notores";

function getApiMetaData(target: any, propertyKey: string) {
    const existingApiMetaData: ApiMetaData = Reflect.getOwnMetadata(apiMetadataKey, target[propertyKey]);

    if (!existingApiMetaData) {
        throw logErrorApiMetaDataDoesNotExist('Restricted', target, propertyKey);
    }
    return existingApiMetaData;
}

function generateHttpMethodDecorator(method: HttpMethod, addId = false) {
    return function Path(path: ApiPath = '/', {swagger = true}: PathOptions = {swagger: true}) {
        return function (target: any, propertyKey: string) {
            const apiMetaData: ApiMetaData = ApiMetaData.getApiMetaData(target, propertyKey)

            apiMetaData.extractPathData(target, propertyKey);

            apiMetaData.setMethod(method);
            apiMetaData.addId = addId;
            apiMetaData.path = path;
            apiMetaData.addSwagger = swagger;
            apiMetaData.swaggerOperationId = propertyKey;

            apiMetaData.save();
        }
    }
}

export function SwaggerRequestBody(body: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject): TargetReturnType {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.addSwaggerRequestBody(body)

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function SwaggerParameters(parameter: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject): TargetReturnType {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.addSwaggerParameter(parameter)

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function SwaggerResponse(statusCode: number, response: ClassType, description?: string): TargetReturnType;
export function SwaggerResponse(statusCode: number, response: ClassType[], description?: string): TargetReturnType;
export function SwaggerResponse(statusCode: number, response: OpenAPIV3.ResponseObject): TargetReturnType;
export function SwaggerResponse(statusCode: number, response: any, description?: string): TargetReturnType {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        if (isResponseObject(response)) {
            existingApiMetaData.addSwaggerResponse(statusCode, response)
        } else {
            existingApiMetaData.addResponseObject(statusCode, response);
        }


        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function SwaggerDoc({operationId, ...operations}: OpenAPIV3.OperationObject): TargetReturnType {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.swaggerDoc = operations;
        if (operationId) existingApiMetaData.swaggerOperationId = operationId;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function ContentType(type: string): TargetReturnType {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.contentType = type;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Accepts(type: string): TargetReturnType;
export function Accepts(type: string[]): TargetReturnType;
export function Accepts(...type: string[]): TargetReturnType;
export function Accepts(): TargetReturnType {
    // @ts-ignore
    const type: string[] = [...new Set(arguments)];

    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.accepts = Array.isArray(type) ? type : [type];

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Restricted(role: string): TargetReturnType;
export function Restricted(roles: string[]): TargetReturnType;
export function Restricted(): TargetReturnType {
    // @ts-ignore
    const roles: string[] = [...new Set(arguments)];
    if (roles.length === 0) {
        roles.push('admin');
    }

    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        logWarningIfNoAuthentication('Restricted', target, propertyKey);

        existingApiMetaData.setRestricted(roles);

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Roles(roles: string[]) {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        logWarningIfNoAuthentication('Roles', target, propertyKey);

        existingApiMetaData.roles = roles;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Authorized(roles: string[]) {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.setAuthorized(roles);

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Authenticated(settings = {redirect: false}) {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.setAuthenticated(settings);

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function SwaggerHideRoute() {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.addSwagger = false;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Admin() {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.setAdmin();

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

/**
 * @deprecated Since version 0.6.0 Will be deleted in version 1.0. Use @Restricted instead.
 */
export function Private() {
    return (target: any, propertyKey: string) => {
        SystemLogger.warn('Decorator @Private is deprecated, please use @Restricted instead');
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.setRestricted(['admin'])

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function PreMiddleware(middleware: Function): TargetReturnType;
export function PreMiddleware(functionName: string): TargetReturnType;
export function PreMiddleware(middlewares: Array<Function>): TargetReturnType;
export function PreMiddleware(functionNames: Array<string>): TargetReturnType;
export function PreMiddleware(middlewaresAndFunctionNames: Array<Function | string>): TargetReturnType;
export function PreMiddleware(input: any): TargetReturnType {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.preMiddlewares = input;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function PostMiddleware(middleware: Function): TargetReturnType;
export function PostMiddleware(functionName: string): TargetReturnType;
export function PostMiddleware(middlewares: Array<Function>): TargetReturnType;
export function PostMiddleware(functionNames: Array<string>): TargetReturnType;
export function PostMiddleware(middlewaresAndFunctionNames: Array<Function | string>): TargetReturnType;
export function PostMiddleware(input: any): TargetReturnType {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.postMiddlewares = input;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Get();
export function Get(path?: ApiPath);
export function Get(options?: CombinedPathOptions);
export function Get(path: ApiPath, options: PathOptions);
export function Get(path?: any, options?: PathOptions) {
    if (path && typeof path !== 'string') {
        const {path: p, ...rest} = path as CombinedPathOptions;
        return generateHttpMethodDecorator(HttpMethod.GET)(p, rest);
    }
    return generateHttpMethodDecorator(HttpMethod.GET)(path, options);
}

export function Post(path?: ApiPath) {
    return generateHttpMethodDecorator(HttpMethod.POST)(path);
}

export function Put(path?: ApiPath) {
    return generateHttpMethodDecorator(HttpMethod.PUT)(path);
}

export function Patch(path?: ApiPath) {
    return generateHttpMethodDecorator(HttpMethod.PATCH)(path);
}

export function Delete(path?: ApiPath) {
    return generateHttpMethodDecorator(HttpMethod.DELETE)(path);
}

export function GetId(path?: string) {
    return generateHttpMethodDecorator(HttpMethod.GET, true)(path);
}

export function PutId(path?: string) {
    return generateHttpMethodDecorator(HttpMethod.PUT, true)(path);
}

export function PatchId(path?: string) {
    return generateHttpMethodDecorator(HttpMethod.PATCH, true)(path);
}

export function DeleteId(path?: string) {
    return generateHttpMethodDecorator(HttpMethod.DELETE, true)(path);
}
