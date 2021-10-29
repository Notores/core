"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = void 0;
const RoutingMetadata_1 = __importDefault(require("./RoutingMetadata"));
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "get";
    HttpMethod["POST"] = "post";
    HttpMethod["PATCH"] = "patch";
    HttpMethod["PUT"] = "put";
    HttpMethod["DELETE"] = "delete";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
class ApiMetaData extends RoutingMetadata_1.default {
    constructor(method, target, propertyKey, addId = false) {
        super(target, propertyKey);
        this._templateAccess = false;
        this._contentType = undefined;
        this._accepts = ['json'];
        this._addId = false;
        this._method = HttpMethod.GET;
        this._preMiddleware = [];
        this._postMiddleware = [];
        this._method = method;
        this._addId = addId;
    }
    set templateAccess(value) {
        this._templateAccess = value;
    }
    set contentType(value) {
        this._contentType = value;
    }
    set accepts(value) {
        this._accepts.push(...(Array.isArray(value) ? value : [value]));
    }
    set preMiddlewares(preMiddleware) {
        this._preMiddleware.push(...(Array.isArray(preMiddleware) ? preMiddleware : [preMiddleware]));
    }
    set postMiddlewares(postMiddleware) {
        this._postMiddleware.push(...(Array.isArray(postMiddleware) ? postMiddleware : [postMiddleware]));
    }
    set pages(pages) {
        if (!this._pages)
            this._pages = [];
        this._pages.push(...Array.isArray(pages) ? pages : [pages]);
    }
    get templateAccess() {
        return this._templateAccess;
    }
    get contentType() {
        return this._contentType;
    }
    get accepts() {
        return this._accepts;
    }
    get method() {
        return this._method.toLowerCase();
    }
    get preMiddlewares() {
        return this._preMiddleware;
    }
    get postMiddlewares() {
        return this._postMiddleware;
    }
    get pages() {
        return this._pages || [];
    }
}
exports.default = ApiMetaData;
