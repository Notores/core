import { apiMetadataKey } from "../symbols";
import { SystemLogger } from "../Notores";
import { ApiMetaData, HttpMethod, isResponseObject, logErrorApiMetaDataDoesNotExist, logWarningIfNoAuthentication } from "../lib";
function getApiMetaData(target, propertyKey) {
    const existingApiMetaData = Reflect.getOwnMetadata(apiMetadataKey, target[propertyKey]);
    if (!existingApiMetaData) {
        throw logErrorApiMetaDataDoesNotExist('Restricted', target, propertyKey);
    }
    return existingApiMetaData;
}
function generateHttpMethodDecorator(method, addId = false) {
    return function Path(path = '/', { swagger = true } = { swagger: true }) {
        return function (target, propertyKey) {
            const apiMetaData = ApiMetaData.getApiMetaData(target, propertyKey);
            apiMetaData.extractPathData(target, propertyKey);
            apiMetaData.setMethod(method);
            apiMetaData.addId = addId;
            apiMetaData.path = path;
            apiMetaData.addSwagger = swagger;
            apiMetaData.swaggerOperationId = propertyKey;
            apiMetaData.save();
        };
    };
}
export function SwaggerRequestBody(body) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.addSwaggerRequestBody(body);
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function SwaggerParameters(parameter) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.addSwaggerParameter(parameter);
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function SwaggerResponse(statusCode, response, description) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        if (isResponseObject(response)) {
            existingApiMetaData.addSwaggerResponse(statusCode, response);
        }
        else {
            existingApiMetaData.addResponseObject(statusCode, response);
        }
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function SwaggerDoc({ operationId, ...operations }) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.swaggerDoc = operations;
        if (operationId)
            existingApiMetaData.swaggerOperationId = operationId;
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function ContentType(type) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.contentType = type;
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function Accepts() {
    // @ts-ignore
    const type = [...new Set(arguments)];
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.accepts = Array.isArray(type) ? type : [type];
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function Restricted() {
    // @ts-ignore
    const roles = [...new Set(arguments)];
    if (roles.length === 0) {
        roles.push('admin');
    }
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        logWarningIfNoAuthentication('Restricted', target, propertyKey);
        existingApiMetaData.setRestricted(roles);
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function Roles(roles) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        logWarningIfNoAuthentication('Roles', target, propertyKey);
        existingApiMetaData.roles = roles;
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function Authorized(roles) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.setAuthorized(roles);
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function Authenticated(settings = { redirect: false }) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.setAuthenticated(settings);
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function SwaggerHideRoute() {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.addSwagger = false;
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function Admin() {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.setAdmin();
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
/**
 * @deprecated Since version 0.6.0 Will be deleted in version 1.0. Use @Restricted instead.
 */
export function Private() {
    return (target, propertyKey) => {
        SystemLogger.warn('Decorator @Private is deprecated, please use @Restricted instead');
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.setRestricted(['admin']);
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function PreMiddleware(input) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.preMiddlewares = input;
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function PostMiddleware(input) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.postMiddlewares = input;
        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
export function Get(path, options) {
    if (path && typeof path !== 'string') {
        const { path: p, ...rest } = path;
        return generateHttpMethodDecorator(HttpMethod.GET)(p, rest);
    }
    return generateHttpMethodDecorator(HttpMethod.GET)(path, options);
}
export function Post(path) {
    return generateHttpMethodDecorator(HttpMethod.POST)(path);
}
export function Put(path) {
    return generateHttpMethodDecorator(HttpMethod.PUT)(path);
}
export function Patch(path) {
    return generateHttpMethodDecorator(HttpMethod.PATCH)(path);
}
export function Delete(path) {
    return generateHttpMethodDecorator(HttpMethod.DELETE)(path);
}
export function GetId(path) {
    return generateHttpMethodDecorator(HttpMethod.GET, true)(path);
}
export function PutId(path) {
    return generateHttpMethodDecorator(HttpMethod.PUT, true)(path);
}
export function PatchId(path) {
    return generateHttpMethodDecorator(HttpMethod.PATCH, true)(path);
}
export function DeleteId(path) {
    return generateHttpMethodDecorator(HttpMethod.DELETE, true)(path);
}
