"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteId = exports.PatchId = exports.PutId = exports.GetId = exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = exports.PostMiddleware = exports.PreMiddleware = exports.Private = exports.Admin = exports.SwaggerHideRoute = exports.Authenticated = exports.Authorized = exports.Roles = exports.Restricted = exports.Accepts = exports.ContentType = exports.SwaggerDoc = exports.SwaggerResponse = exports.SwaggerParameters = exports.SwaggerRequestBody = void 0;
const symbols_1 = require("../symbols");
const Notores_1 = require("../Notores");
const lib_1 = require("../lib");
function getApiMetaData(target, propertyKey) {
    const existingApiMetaData = Reflect.getOwnMetadata(symbols_1.apiMetadataKey, target[propertyKey]);
    if (!existingApiMetaData) {
        throw (0, lib_1.logErrorApiMetaDataDoesNotExist)('Restricted', target, propertyKey);
    }
    return existingApiMetaData;
}
function generateHttpMethodDecorator(method, addId = false) {
    return function Path(path = '/', { swagger = true } = { swagger: true }) {
        return function (target, propertyKey) {
            const apiMetaData = lib_1.ApiMetaData.getApiMetaData(target, propertyKey);
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
function SwaggerRequestBody(body) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.addSwaggerRequestBody(body);
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.SwaggerRequestBody = SwaggerRequestBody;
function SwaggerParameters(parameter) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.addSwaggerParameter(parameter);
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.SwaggerParameters = SwaggerParameters;
function SwaggerResponse(statusCode, response, description) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        if ((0, lib_1.isResponseObject)(response)) {
            existingApiMetaData.addSwaggerResponse(statusCode, response);
        }
        else {
            existingApiMetaData.addResponseObject(statusCode, response);
        }
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.SwaggerResponse = SwaggerResponse;
function SwaggerDoc(_a) {
    var { operationId } = _a, operations = __rest(_a, ["operationId"]);
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.swaggerDoc = operations;
        if (operationId)
            existingApiMetaData.swaggerOperationId = operationId;
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.SwaggerDoc = SwaggerDoc;
function ContentType(type) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.contentType = type;
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.ContentType = ContentType;
function Accepts() {
    // @ts-ignore
    const type = [...new Set(arguments)];
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.accepts = Array.isArray(type) ? type : [type];
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.Accepts = Accepts;
function Restricted() {
    // @ts-ignore
    const roles = [...new Set(arguments)];
    if (roles.length === 0) {
        roles.push('admin');
    }
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        (0, lib_1.logWarningIfNoAuthentication)('Restricted', target, propertyKey);
        existingApiMetaData.setRestricted(roles);
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.Restricted = Restricted;
function Roles(roles) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        (0, lib_1.logWarningIfNoAuthentication)('Roles', target, propertyKey);
        existingApiMetaData.roles = roles;
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.Roles = Roles;
function Authorized(roles) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.setAuthorized(roles);
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.Authorized = Authorized;
function Authenticated(settings = { redirect: false }) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.setAuthenticated(settings);
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.Authenticated = Authenticated;
function SwaggerHideRoute() {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.addSwagger = false;
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.SwaggerHideRoute = SwaggerHideRoute;
function Admin() {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.setAdmin();
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.Admin = Admin;
/**
 * @deprecated Since version 0.6.0 Will be deleted in version 1.0. Use @Restricted instead.
 */
function Private() {
    return (target, propertyKey) => {
        Notores_1.SystemLogger.warn('Decorator @Private is deprecated, please use @Restricted instead');
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.setRestricted(['admin']);
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.Private = Private;
function PreMiddleware(input) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.preMiddlewares = input;
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.PreMiddleware = PreMiddleware;
function PostMiddleware(input) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.postMiddlewares = input;
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.PostMiddleware = PostMiddleware;
function Get(path, options) {
    if (path && typeof path !== 'string') {
        const _a = path, { path: p } = _a, rest = __rest(_a, ["path"]);
        return generateHttpMethodDecorator(lib_1.HttpMethod.GET)(p, rest);
    }
    return generateHttpMethodDecorator(lib_1.HttpMethod.GET)(path, options);
}
exports.Get = Get;
function Post(path) {
    return generateHttpMethodDecorator(lib_1.HttpMethod.POST)(path);
}
exports.Post = Post;
function Put(path) {
    return generateHttpMethodDecorator(lib_1.HttpMethod.PUT)(path);
}
exports.Put = Put;
function Patch(path) {
    return generateHttpMethodDecorator(lib_1.HttpMethod.PATCH)(path);
}
exports.Patch = Patch;
function Delete(path) {
    return generateHttpMethodDecorator(lib_1.HttpMethod.DELETE)(path);
}
exports.Delete = Delete;
function GetId(path) {
    return generateHttpMethodDecorator(lib_1.HttpMethod.GET, true)(path);
}
exports.GetId = GetId;
function PutId(path) {
    return generateHttpMethodDecorator(lib_1.HttpMethod.PUT, true)(path);
}
exports.PutId = PutId;
function PatchId(path) {
    return generateHttpMethodDecorator(lib_1.HttpMethod.PATCH, true)(path);
}
exports.PatchId = PatchId;
function DeleteId(path) {
    return generateHttpMethodDecorator(lib_1.HttpMethod.DELETE, true)(path);
}
exports.DeleteId = DeleteId;
