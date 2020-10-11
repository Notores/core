"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteId = exports.PatchId = exports.PutId = exports.GetId = exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = exports.Page = exports.Pages = exports.PostMiddleware = exports.PreMiddleware = exports.Private = exports.Admin = exports.Authenticated = exports.Authorized = exports.Roles = exports.Restricted = void 0;
const helpers_1 = require("./helpers");
const symbols_1 = require("../symbols");
const Notores_1 = require("../Notores");
const ApiMetaData_1 = __importStar(require("../lib/ApiMetaData"));
function getApiMetaData(target, propertyKey) {
    const existingApiMetaData = Reflect.getOwnMetadata(symbols_1.apiMetadataKey, target[propertyKey]);
    if (!existingApiMetaData) {
        throw helpers_1.logErrorApiMetaDataDoesNotExist('Restricted', target, propertyKey);
    }
    return existingApiMetaData;
}
function generateHttpMethodDecorator(method, addId = false) {
    return function Path(paths = ['/']) {
        return function (target, propertyKey) {
            var _a;
            const existingApiMetaData = (_a = Reflect.getOwnMetadata(symbols_1.apiMetadataKey, target[propertyKey])) !== null && _a !== void 0 ? _a : new ApiMetaData_1.default(method, target, propertyKey, addId);
            existingApiMetaData.paths = Array.isArray(paths) ? paths : [paths];
            Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
        };
    };
}
function Restricted(roles = ['admin']) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        helpers_1.logWarningIfNoAuthentication('Restricted', target, propertyKey);
        existingApiMetaData.setRestricted(roles);
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.Restricted = Restricted;
function Roles(roles) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        helpers_1.logWarningIfNoAuthentication('Roles', target, propertyKey);
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
function PreMiddleware(middlewares) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.preMiddlewares = middlewares;
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.PreMiddleware = PreMiddleware;
function PostMiddleware(middlewares) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.postMiddlewares = middlewares;
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.PostMiddleware = PostMiddleware;
function Pages(pages) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.pages = pages;
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.Pages = Pages;
function Page(page) {
    return (target, propertyKey) => {
        const existingApiMetaData = getApiMetaData(target, propertyKey);
        existingApiMetaData.pages = [page];
        Reflect.defineMetadata(symbols_1.apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}
exports.Page = Page;
function Get(path) {
    return generateHttpMethodDecorator(ApiMetaData_1.HttpMethod.GET)(path);
}
exports.Get = Get;
function Post(path) {
    return generateHttpMethodDecorator(ApiMetaData_1.HttpMethod.POST)(path);
}
exports.Post = Post;
function Put(path) {
    return generateHttpMethodDecorator(ApiMetaData_1.HttpMethod.PUT)(path);
}
exports.Put = Put;
function Patch(path) {
    return generateHttpMethodDecorator(ApiMetaData_1.HttpMethod.PATCH)(path);
}
exports.Patch = Patch;
function Delete(path) {
    return generateHttpMethodDecorator(ApiMetaData_1.HttpMethod.DELETE)(path);
}
exports.Delete = Delete;
function GetId(path) {
    return generateHttpMethodDecorator(ApiMetaData_1.HttpMethod.GET, true)(path);
}
exports.GetId = GetId;
function PutId(path) {
    return generateHttpMethodDecorator(ApiMetaData_1.HttpMethod.PUT, true)(path);
}
exports.PutId = PutId;
function PatchId(path) {
    return generateHttpMethodDecorator(ApiMetaData_1.HttpMethod.PATCH, true)(path);
}
exports.PatchId = PatchId;
function DeleteId(path) {
    return generateHttpMethodDecorator(ApiMetaData_1.HttpMethod.DELETE, true)(path);
}
exports.DeleteId = DeleteId;
