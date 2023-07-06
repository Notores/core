"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ApiMetaData_contentType, _ApiMetaData_accepts, _ApiMetaData_addId, _ApiMetaData_method, _ApiMetaData_preMiddleware, _ApiMetaData_postMiddleware, _ApiMetaData_addSwagger, _ApiMetaData_returnType, _ApiMetaData_requestBody, _ApiMetaData_responseObjects, _ApiMetaData_swaggerDoc, _ApiMetaData_swaggerPath;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiMetaData = exports.HttpMethod = void 0;
const RoutingMetadata_1 = __importDefault(require("./RoutingMetadata"));
const classHelpers_1 = require("./classHelpers");
const symbols_1 = require("../symbols");
const SwaggerHelpers_1 = require("./SwaggerHelpers");
const Generic_1 = require("./Generic");
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "get";
    HttpMethod["POST"] = "post";
    HttpMethod["PATCH"] = "patch";
    HttpMethod["PUT"] = "put";
    HttpMethod["DELETE"] = "delete";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
class ApiMetaData extends RoutingMetadata_1.default {
    constructor(target, propertyKey) {
        super(target, propertyKey);
        _ApiMetaData_contentType.set(this, 'application/json');
        _ApiMetaData_accepts.set(this, ['json']);
        _ApiMetaData_addId.set(this, false);
        _ApiMetaData_method.set(this, HttpMethod.GET);
        _ApiMetaData_preMiddleware.set(this, []);
        _ApiMetaData_postMiddleware.set(this, []);
        _ApiMetaData_addSwagger.set(this, true);
        _ApiMetaData_returnType.set(this, null);
        _ApiMetaData_requestBody.set(this, null);
        _ApiMetaData_responseObjects.set(this, []);
        _ApiMetaData_swaggerDoc.set(this, {
            responses: {},
            parameters: [],
            tags: [],
        });
        _ApiMetaData_swaggerPath.set(this, '');
        __classPrivateFieldSet(this, _ApiMetaData_swaggerPath, `${this._path}`, "f");
    }
    static getApiMetaData(target, propertyKey) {
        var _a;
        return (_a = Reflect.getOwnMetadata(symbols_1.apiMetadataKey, target[propertyKey])) !== null && _a !== void 0 ? _a : new ApiMetaData(target, propertyKey);
    }
    save() {
        Reflect.defineMetadata(symbols_1.apiMetadataKey, this, this._target[this._propertyKey]);
    }
    extractPathData(target, propertyKey) {
        const returntype = Reflect.getMetadata('design:returntype', target, propertyKey);
        if (returntype && (0, classHelpers_1.isClassType)(returntype) && returntype.name !== 'Object') {
            __classPrivateFieldSet(this, _ApiMetaData_returnType, returntype, "f");
        }
    }
    setResponses(responseKey) {
        for (const { statusCode, entity, description } of __classPrivateFieldGet(this, _ApiMetaData_responseObjects, "f")) {
            const isArray = Array.isArray(entity);
            const refType = isArray ? entity[0] : entity;
            const schema = isArray ? {
                type: 'array',
                items: (0, SwaggerHelpers_1.generateRefObject)(refType)
            } : (0, SwaggerHelpers_1.generateRefObject)(refType);
            if (responseKey) {
                this.addSwaggerResponse(statusCode, {
                    description: description || `${(0, Generic_1.capitalizeFirstLetter)(this.method)}`,
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    [responseKey]: schema
                                }
                            }
                        }
                    }
                });
                continue;
            }
            // TODO: Check if this works. Test by not setting a dataKey in @Module
            this.addSwaggerResponse(statusCode, {
                description: description || `${(0, Generic_1.capitalizeFirstLetter)(this.method)}`,
                content: {
                    'application/json': {
                        schema
                    }
                }
            });
        }
        return this;
    }
    addDefaultResponse(responseKey) {
        let defaultResponseStatus = 200;
        if (__classPrivateFieldGet(this, _ApiMetaData_method, "f").toLowerCase() === 'post') {
            defaultResponseStatus = 201;
        }
        if ((0, classHelpers_1.isClassType)(__classPrivateFieldGet(this, _ApiMetaData_returnType, "f")) && __classPrivateFieldGet(this, _ApiMetaData_returnType, "f").name !== 'Object') {
            // this.#returnType = returntype;
            if (responseKey) {
                this.addSwaggerResponse(defaultResponseStatus, {
                    description: `${(0, Generic_1.capitalizeFirstLetter)(this.method)} ${__classPrivateFieldGet(this, _ApiMetaData_returnType, "f").name} ${__classPrivateFieldGet(this, _ApiMetaData_addId, "f") ? 'by id' : ''}`,
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    [responseKey]: (0, SwaggerHelpers_1.generateRefObject)(__classPrivateFieldGet(this, _ApiMetaData_returnType, "f")),
                                }
                            }
                        }
                    }
                });
            }
            else {
                this.addSwaggerResponse(defaultResponseStatus, (0, SwaggerHelpers_1.generateRefObject)(__classPrivateFieldGet(this, _ApiMetaData_returnType, "f")));
            }
        }
        return this;
    }
    addDefaultParameter(entity) {
        const params = typeof this.path === 'string' ? (0, Generic_1.getAllPathParams)(this.path) : [];
        if (__classPrivateFieldGet(this, _ApiMetaData_addId, "f"))
            params.push(':id');
        if (params.length === 0)
            return this;
        for (const param of params) {
            const paramKey = param.substring(1);
            const paramExists = __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").parameters.find((parameter) => !(0, SwaggerHelpers_1.isReferenceObject)(parameter) && parameter.name === paramKey);
            if (paramExists)
                continue;
            this.addSwaggerParameter({
                name: paramKey,
                in: 'path',
                description: `Filter ${entity.name} by ${paramKey}`,
                required: true,
                deprecated: false,
                allowEmptyValue: false,
            });
        }
        return this;
    }
    addPathPrefix(prefix) {
        super.addPathPrefix(prefix);
        if (typeof __classPrivateFieldGet(this, _ApiMetaData_swaggerPath, "f") === 'string') {
            if (__classPrivateFieldGet(this, _ApiMetaData_swaggerPath, "f") === '/') {
                __classPrivateFieldSet(this, _ApiMetaData_swaggerPath, prefix, "f");
                return this;
            }
            let newPath = `${prefix}`;
            if (prefix.endsWith('/') || __classPrivateFieldGet(this, _ApiMetaData_swaggerPath, "f").startsWith('/')) {
                newPath += __classPrivateFieldGet(this, _ApiMetaData_swaggerPath, "f");
            }
            else {
                newPath += `/${__classPrivateFieldGet(this, _ApiMetaData_swaggerPath, "f")}`;
            }
            __classPrivateFieldSet(this, _ApiMetaData_swaggerPath, newPath, "f");
        }
        return this;
    }
    addTag(tag) {
        __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").tags.push(tag);
        return this;
    }
    set addId(addId) {
        __classPrivateFieldSet(this, _ApiMetaData_addId, addId, "f");
    }
    get addId() {
        return __classPrivateFieldGet(this, _ApiMetaData_addId, "f");
    }
    set requestBody(requestBody) {
        __classPrivateFieldSet(this, _ApiMetaData_requestBody, requestBody, "f");
        __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").requestBody = {
            description: `Payload ${__classPrivateFieldGet(this, _ApiMetaData_requestBody, "f").name}`,
            content: {
                [__classPrivateFieldGet(this, _ApiMetaData_contentType, "f")]: {
                    schema: (0, SwaggerHelpers_1.generateRefObject)(__classPrivateFieldGet(this, _ApiMetaData_requestBody, "f"))
                }
            }
        };
    }
    get requestBody() {
        return __classPrivateFieldGet(this, _ApiMetaData_requestBody, "f");
    }
    set swaggerTags(tags) {
        __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").tags = tags;
    }
    set swaggerSummary(summary) {
        __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").summary = summary;
    }
    set swaggerDescription(description) {
        __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").description = description;
    }
    set swaggerOperationId(operationId) {
        __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").operationId = operationId;
    }
    addSwaggerParameter(parameter) {
        const existingParameterDescription = __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").parameters.find((parameterObject) => {
            if (parameter['$ref']) {
                return parameterObject['$ref'] === parameter['$ref'];
            }
            return parameterObject.name === parameter.name;
        });
        if (existingParameterDescription) {
            Object.assign(existingParameterDescription, parameter);
            return this;
        }
        if (__classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").parameters)
            __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").parameters.push(parameter);
        return this;
    }
    addSwaggerRequestBody(requestBody) {
        __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").requestBody = requestBody;
        return this;
    }
    addResponseObject(statusCode, entity, description) {
        __classPrivateFieldGet(this, _ApiMetaData_responseObjects, "f").push({ statusCode, entity, description });
    }
    addSwaggerResponse(statusCode, response) {
        Object.assign(__classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").responses, { [`${statusCode}`]: response });
        return this;
    }
    addSwaggerQueryParameter(key, type) {
        __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").parameters.push({
            name: key,
            in: 'query',
            schema: {
                type: typeof type === 'function' ? type.name.toLowerCase() : type,
            },
        });
        return this;
    }
    set swaggerDeprecated(deprecated) {
        __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f").deprecated = deprecated;
    }
    set contentType(value) {
        __classPrivateFieldSet(this, _ApiMetaData_contentType, value, "f");
    }
    set accepts(value) {
        __classPrivateFieldGet(this, _ApiMetaData_accepts, "f").push(...(Array.isArray(value) ? value : [value]));
    }
    set preMiddlewares(preMiddleware) {
        __classPrivateFieldGet(this, _ApiMetaData_preMiddleware, "f").push(...(Array.isArray(preMiddleware) ? preMiddleware : [preMiddleware]));
    }
    set postMiddlewares(postMiddleware) {
        __classPrivateFieldGet(this, _ApiMetaData_postMiddleware, "f").push(...(Array.isArray(postMiddleware) ? postMiddleware : [postMiddleware]));
    }
    get contentType() {
        return __classPrivateFieldGet(this, _ApiMetaData_contentType, "f");
    }
    get accepts() {
        return __classPrivateFieldGet(this, _ApiMetaData_accepts, "f");
    }
    get method() {
        return __classPrivateFieldGet(this, _ApiMetaData_method, "f");
    }
    setMethod(method) {
        __classPrivateFieldSet(this, _ApiMetaData_method, method, "f");
    }
    // set method(method: HttpMethod) {
    //     this.#method = method;
    // }
    get preMiddlewares() {
        return __classPrivateFieldGet(this, _ApiMetaData_preMiddleware, "f");
    }
    get postMiddlewares() {
        return __classPrivateFieldGet(this, _ApiMetaData_postMiddleware, "f");
    }
    set addSwagger(swagger) {
        __classPrivateFieldSet(this, _ApiMetaData_addSwagger, swagger, "f");
    }
    get addSwagger() {
        return __classPrivateFieldGet(this, _ApiMetaData_addSwagger, "f");
    }
    set swaggerDoc(swaggerDoc) {
        __classPrivateFieldSet(this, _ApiMetaData_swaggerDoc, swaggerDoc, "f");
    }
    get swaggerDoc() {
        return __classPrivateFieldGet(this, _ApiMetaData_swaggerDoc, "f");
    }
    replacePathParams(path) {
        const pathParams = (0, Generic_1.getAllPathParams)(path);
        if (pathParams.length === 0)
            return path;
        let resp = `${path}`;
        for (const param of pathParams) {
            resp = resp.replace(param, `{${param.substring(1)}}`);
        }
        return resp;
    }
    get swaggerPath() {
        let path = this.path;
        if (typeof path !== 'string')
            return path;
        if (this.restricted) {
            path = path.startsWith('/') ? `/n-admin${path}` : `/n-admin/${path}`;
        }
        path = this.replacePathParams(path);
        console.log('path', path);
        return path;
    }
    set swaggerPath(value) {
        if (__classPrivateFieldGet(this, _ApiMetaData_addId, "f")) {
            if (typeof this._path === 'string')
                this._path += this._path.endsWith('/') ? ':id' : '/:id';
            if (typeof __classPrivateFieldGet(this, _ApiMetaData_swaggerPath, "f") === 'string')
                __classPrivateFieldSet(this, _ApiMetaData_swaggerPath, __classPrivateFieldGet(this, _ApiMetaData_swaggerPath, "f") + (__classPrivateFieldGet(this, _ApiMetaData_swaggerPath, "f").endsWith('/') ? '{id}' : '/{id}'), "f");
        }
        __classPrivateFieldSet(this, _ApiMetaData_swaggerPath, value, "f");
    }
    get path() {
        let path = super.path;
        if (typeof path !== 'string')
            return path;
        if (__classPrivateFieldGet(this, _ApiMetaData_addId, "f")) {
            path += path.endsWith('/') ? ':id' : '/:id';
        }
        return path;
    }
    set path(path) {
        super.path = path;
    }
}
exports.ApiMetaData = ApiMetaData;
_ApiMetaData_contentType = new WeakMap(), _ApiMetaData_accepts = new WeakMap(), _ApiMetaData_addId = new WeakMap(), _ApiMetaData_method = new WeakMap(), _ApiMetaData_preMiddleware = new WeakMap(), _ApiMetaData_postMiddleware = new WeakMap(), _ApiMetaData_addSwagger = new WeakMap(), _ApiMetaData_returnType = new WeakMap(), _ApiMetaData_requestBody = new WeakMap(), _ApiMetaData_responseObjects = new WeakMap(), _ApiMetaData_swaggerDoc = new WeakMap(), _ApiMetaData_swaggerPath = new WeakMap();
