import RoutingMetadata from "./RoutingMetadata";
import { isClassType } from "./classHelpers";
import { apiMetadataKey } from "../symbols";
import { generateRefObject, isReferenceObject } from "./SwaggerHelpers";
import { capitalizeFirstLetter, getAllPathParams } from "./Generic";
export var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "get";
    HttpMethod["POST"] = "post";
    HttpMethod["PATCH"] = "patch";
    HttpMethod["PUT"] = "put";
    HttpMethod["DELETE"] = "delete";
})(HttpMethod || (HttpMethod = {}));
export class ApiMetaData extends RoutingMetadata {
    static getApiMetaData(target, propertyKey) {
        return Reflect.getOwnMetadata(apiMetadataKey, target[propertyKey]) ?? new ApiMetaData(target, propertyKey);
    }
    #contentType = 'application/json';
    #accepts = ['json'];
    #addId = false;
    #method = HttpMethod.GET;
    #preMiddleware = [];
    #postMiddleware = [];
    #addSwagger = true;
    #returnType = null;
    #requestBody = null;
    #responseObjects = [];
    #swaggerDoc = {
        responses: {},
        parameters: [],
        tags: [],
    };
    #swaggerPath = '';
    constructor(target, propertyKey) {
        super(target, propertyKey);
        this.#swaggerPath = `${this._path}`;
    }
    save() {
        Reflect.defineMetadata(apiMetadataKey, this, this._target[this._propertyKey]);
    }
    extractPathData(target, propertyKey) {
        const returntype = Reflect.getMetadata('design:returntype', target, propertyKey);
        if (returntype && isClassType(returntype) && returntype.name !== 'Object') {
            this.#returnType = returntype;
        }
    }
    setResponses(responseKey) {
        for (const { statusCode, entity, description } of this.#responseObjects) {
            const isArray = Array.isArray(entity);
            const refType = isArray ? entity[0] : entity;
            const schema = isArray ? {
                type: 'array',
                items: generateRefObject(refType)
            } : generateRefObject(refType);
            if (responseKey) {
                this.addSwaggerResponse(statusCode, {
                    description: description || `${capitalizeFirstLetter(this.method)}`,
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
                description: description || `${capitalizeFirstLetter(this.method)}`,
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
        if (this.#method.toLowerCase() === 'post') {
            defaultResponseStatus = 201;
        }
        if (isClassType(this.#returnType) && this.#returnType.name !== 'Object') {
            // this.#returnType = returntype;
            if (responseKey) {
                this.addSwaggerResponse(defaultResponseStatus, {
                    description: `${capitalizeFirstLetter(this.method)} ${this.#returnType.name} ${this.#addId ? 'by id' : ''}`,
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    [responseKey]: generateRefObject(this.#returnType),
                                }
                            }
                        }
                    }
                });
            }
            else {
                this.addSwaggerResponse(defaultResponseStatus, generateRefObject(this.#returnType));
            }
        }
        return this;
    }
    addDefaultParameter(entity) {
        const params = typeof this.path === 'string' ? getAllPathParams(this.path) : [];
        if (this.#addId)
            params.push(':id');
        if (params.length === 0)
            return this;
        for (const param of params) {
            const paramKey = param.substring(1);
            const paramExists = this.#swaggerDoc.parameters.find((parameter) => !isReferenceObject(parameter) && parameter.name === paramKey);
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
        if (typeof this.#swaggerPath === 'string') {
            if (this.#swaggerPath === '/') {
                this.#swaggerPath = prefix;
                return this;
            }
            let newPath = `${prefix}`;
            if (prefix.endsWith('/') || this.#swaggerPath.startsWith('/')) {
                newPath += this.#swaggerPath;
            }
            else {
                newPath += `/${this.#swaggerPath}`;
            }
            this.#swaggerPath = newPath;
        }
        return this;
    }
    addTag(tag) {
        this.#swaggerDoc.tags.push(tag);
        return this;
    }
    set addId(addId) {
        this.#addId = addId;
    }
    get addId() {
        return this.#addId;
    }
    set requestBody(requestBody) {
        this.#requestBody = requestBody;
        this.#swaggerDoc.requestBody = {
            description: `Payload ${this.#requestBody.name}`,
            content: {
                [this.#contentType]: {
                    schema: generateRefObject(this.#requestBody)
                }
            }
        };
    }
    get requestBody() {
        return this.#requestBody;
    }
    set swaggerTags(tags) {
        this.#swaggerDoc.tags = tags;
    }
    set swaggerSummary(summary) {
        this.#swaggerDoc.summary = summary;
    }
    set swaggerDescription(description) {
        this.#swaggerDoc.description = description;
    }
    set swaggerOperationId(operationId) {
        this.#swaggerDoc.operationId = operationId;
    }
    addSwaggerParameter(parameter) {
        const existingParameterDescription = this.#swaggerDoc.parameters.find((parameterObject) => {
            if (parameter['$ref']) {
                return parameterObject['$ref'] === parameter['$ref'];
            }
            return parameterObject.name === parameter.name;
        });
        if (existingParameterDescription) {
            Object.assign(existingParameterDescription, parameter);
            return this;
        }
        if (this.#swaggerDoc.parameters)
            this.#swaggerDoc.parameters.push(parameter);
        return this;
    }
    addSwaggerRequestBody(requestBody) {
        this.#swaggerDoc.requestBody = requestBody;
        return this;
    }
    addResponseObject(statusCode, entity, description) {
        this.#responseObjects.push({ statusCode, entity, description });
    }
    addSwaggerResponse(statusCode, response) {
        Object.assign(this.#swaggerDoc.responses, { [`${statusCode}`]: response });
        return this;
    }
    addSwaggerQueryParameter(key, type) {
        this.#swaggerDoc.parameters.push({
            name: key,
            in: 'query',
            schema: {
                type: typeof type === 'function' ? type.name.toLowerCase() : type,
            },
        });
        return this;
    }
    set swaggerDeprecated(deprecated) {
        this.#swaggerDoc.deprecated = deprecated;
    }
    set contentType(value) {
        this.#contentType = value;
    }
    set accepts(value) {
        this.#accepts.push(...(Array.isArray(value) ? value : [value]));
    }
    set preMiddlewares(preMiddleware) {
        this.#preMiddleware.push(...(Array.isArray(preMiddleware) ? preMiddleware : [preMiddleware]));
    }
    set postMiddlewares(postMiddleware) {
        this.#postMiddleware.push(...(Array.isArray(postMiddleware) ? postMiddleware : [postMiddleware]));
    }
    get contentType() {
        return this.#contentType;
    }
    get accepts() {
        return this.#accepts;
    }
    get method() {
        return this.#method;
    }
    setMethod(method) {
        this.#method = method;
    }
    // set method(method: HttpMethod) {
    //     this.#method = method;
    // }
    get preMiddlewares() {
        return this.#preMiddleware;
    }
    get postMiddlewares() {
        return this.#postMiddleware;
    }
    set addSwagger(swagger) {
        this.#addSwagger = swagger;
    }
    get addSwagger() {
        return this.#addSwagger;
    }
    set swaggerDoc(swaggerDoc) {
        this.#swaggerDoc = swaggerDoc;
    }
    get swaggerDoc() {
        return this.#swaggerDoc;
    }
    replacePathParams(path) {
        const pathParams = getAllPathParams(path);
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
        if (this.#addId) {
            if (typeof this._path === 'string')
                this._path += this._path.endsWith('/') ? ':id' : '/:id';
            if (typeof this.#swaggerPath === 'string')
                this.#swaggerPath += this.#swaggerPath.endsWith('/') ? '{id}' : '/{id}';
        }
        this.#swaggerPath = value;
    }
    get path() {
        let path = super.path;
        if (typeof path !== 'string')
            return path;
        if (this.#addId) {
            path += path.endsWith('/') ? ':id' : '/:id';
        }
        return path;
    }
    set path(path) {
        super.path = path;
    }
}
