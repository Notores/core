import RoutingMetadata from "./RoutingMetadata";
import {ClassType, PrimitiveNonArrayType} from "../types/Notores";
import {OpenAPIV3} from "openapi-types";
import {isClassType} from "./classHelpers";
import {apiMetadataKey} from "../symbols";
import {generateRefObject, isArraySchemaObject, isReferenceObject} from "./SwaggerHelpers";
import {capitalizeFirstLetter, getAllPathParams} from "./Generic";

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    PUT = 'put',
    DELETE = 'delete',
}

export class ApiMetaData extends RoutingMetadata {

    static getApiMetaData(target: any, propertyKey: string) {
        return Reflect.getOwnMetadata(
            apiMetadataKey,
            target[propertyKey]
        ) ?? new ApiMetaData(target, propertyKey)
    }

    #contentType?: string = 'application/json';
    #accepts: string[] = ['json'];
    #addId: boolean = false;
    #method: HttpMethod = HttpMethod.GET;
    #preMiddleware: Array<Function | string> = [];
    #postMiddleware: Array<Function | string> = [];
    #addSwagger: boolean = true;
    #returnType: ClassType = null;
    #requestBody: ClassType = null;
    #responseObjects: Array<{ statusCode: number, entity: ClassType | ClassType[], description?: string }> = [];
    #swaggerDoc: OpenAPIV3.OperationObject = {
        responses: {},
        parameters: [],
        tags: [],
    };
    #swaggerPath: string | RegExp = '';

    constructor(target: any, propertyKey: string) {
        super(target, propertyKey)
        this.#swaggerPath = `${this._path}`;
    }

    save() {
        Reflect.defineMetadata(apiMetadataKey, this, this._target[this._propertyKey]);
    }

    extractPathData(target: any, propertyKey: string) {
        const returntype = Reflect.getMetadata('design:returntype', target, propertyKey);

        if (returntype && isClassType(returntype) && returntype.name !== 'Object') {
            this.#returnType = returntype;
        }
    }

    setResponses(responseKey?: string | false): this {
        for (const {statusCode, entity, description} of this.#responseObjects) {
            const isArray: boolean = Array.isArray(entity);
            const refType: ClassType = isArray ? entity[0] : entity;
            const schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject = isArray ? {
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
                })

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

    addDefaultResponse(responseKey?: string | false) {
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
                })
            } else {
                this.addSwaggerResponse(defaultResponseStatus, generateRefObject(this.#returnType))
            }
        }
        return this;
    }

    addDefaultParameter(entity: ClassType): this {
        const params: string[] = typeof this.path === 'string' ? getAllPathParams(this.path) : [];
        if (this.#addId) params.push(':id');

        if (params.length === 0) return this;

        for (const param of params) {
            const paramKey = param.substring(1);
            const paramExists = this.#swaggerDoc.parameters.find(
                (parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject) => !isReferenceObject(parameter) && parameter.name === paramKey
            );
            if (paramExists) continue;
            this.addSwaggerParameter({
                name: paramKey,
                in: 'path',
                description: `Filter ${entity.name} by ${paramKey}`,
                required: true,
                deprecated: false,
                allowEmptyValue: false,
            })
        }

        return this;
    }

    addPathPrefix(prefix: string): this {
        super.addPathPrefix(prefix);
        if (typeof this.#swaggerPath === 'string') {
            if (this.#swaggerPath === '/') {
                this.#swaggerPath = prefix;
                return this;
            }
            let newPath = `${prefix}`;
            if (prefix.endsWith('/') || this.#swaggerPath.startsWith('/')) {
                newPath += this.#swaggerPath;
            } else {
                newPath += `/${this.#swaggerPath}`;
            }
            this.#swaggerPath = newPath
        }
        return this;
    }

    addTag(tag: string): this {
        this.#swaggerDoc.tags.push(tag);
        return this;
    }

    set addId(addId: boolean) {
        this.#addId = addId;
    }

    get addId() {
        return this.#addId;
    }

    set requestBody(requestBody: ClassType) {
        this.#requestBody = requestBody;
        this.#swaggerDoc.requestBody = {
            description: `Payload ${this.#requestBody.name}`,
            content: {
                [this.#contentType]: {
                    schema: generateRefObject(this.#requestBody)
                }
            }
        }
    }

    get requestBody() {
        return this.#requestBody;
    }

    set swaggerTags(tags: string[]) {
        this.#swaggerDoc.tags = tags;
    }

    set swaggerSummary(summary: string) {
        this.#swaggerDoc.summary = summary;
    }

    set swaggerDescription(description: string) {
        this.#swaggerDoc.description = description;
    }

    set swaggerOperationId(operationId: string) {
        this.#swaggerDoc.operationId = operationId;
    }

    addSwaggerParameter(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject): this {
        const existingParameterDescription = this.#swaggerDoc.parameters.find((parameterObject: OpenAPIV3.ParameterObject) => {
            if (parameter['$ref']) {
                return parameterObject['$ref'] === parameter['$ref'];
            }
            return (parameterObject as OpenAPIV3.ParameterObject).name === (parameter as OpenAPIV3.ParameterObject).name
        })
        if (existingParameterDescription) {
            Object.assign(existingParameterDescription, parameter);
            return this;
        }

        if (this.#swaggerDoc.parameters)
            this.#swaggerDoc.parameters.push(parameter)
        return this;
    }

    addSwaggerRequestBody(requestBody: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject): this {
        this.#swaggerDoc.requestBody = requestBody;
        return this;
    }

    addResponseObject(statusCode: number, entity: ClassType | ClassType[], description?: string) {
        this.#responseObjects.push({statusCode, entity, description})
    }

    addSwaggerResponse(statusCode: number, response: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject): this {
        Object.assign(this.#swaggerDoc.responses, {[`${statusCode}`]: response});
        return this;
    }

    addSwaggerQueryParameter(key: string, type: PrimitiveNonArrayType | Function): this {
        this.#swaggerDoc.parameters.push({
            name: key,
            in: 'query',
            schema: {
                type: typeof type === 'function' ? type.name.toLowerCase() as PrimitiveNonArrayType : type,
            },
        });
        return this;
    }

    set swaggerDeprecated(deprecated: boolean) {
        this.#swaggerDoc.deprecated = deprecated;
    }

    set contentType(value: string | undefined) {
        this.#contentType = value;
    }

    set accepts(value: string[]) {
        this.#accepts.push(...(Array.isArray(value) ? value : [value]));
    }

    set preMiddlewares(preMiddleware: any | any[]) {
        this.#preMiddleware.push(...(Array.isArray(preMiddleware) ? preMiddleware : [preMiddleware]));
    }

    set postMiddlewares(postMiddleware: any | any[]) {
        this.#postMiddleware.push(...(Array.isArray(postMiddleware) ? postMiddleware : [postMiddleware]));
    }

    get contentType() {
        return this.#contentType;
    }

    get accepts(): string[] {
        return this.#accepts;
    }

    get method(): string {
        return this.#method;
    }

    setMethod(method: HttpMethod) {
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

    set addSwagger(swagger: boolean) {
        this.#addSwagger = swagger;
    }

    get addSwagger() {
        return this.#addSwagger;
    }

    set swaggerDoc(swaggerDoc: OpenAPIV3.OperationObject) {
        this.#swaggerDoc = swaggerDoc;
    }

    get swaggerDoc() {
        return this.#swaggerDoc;
    }

    replacePathParams(path: string) {
        const pathParams: string[] = getAllPathParams(path);
        if (pathParams.length === 0) return path;
        let resp = `${path}`;
        for (const param of pathParams) {
            resp = resp.replace(param, `{${param.substring(1)}}`)
        }
        return resp;
    }

    get swaggerPath(): string | RegExp {
        let path = this.path;
        if (typeof path !== 'string') return path;
        if (this.restricted) {
            path = path.startsWith('/') ? `/n-admin${path}` : `/n-admin/${path}`;
        }
        path = this.replacePathParams(path);
        console.log('path', path);
        return path;
    }

    set swaggerPath(value: string | RegExp) {
        if (this.#addId) {
            if (typeof this._path === 'string')
                this._path += this._path.endsWith('/') ? ':id' : '/:id';
            if (typeof this.#swaggerPath === 'string')
                this.#swaggerPath += this.#swaggerPath.endsWith('/') ? '{id}' : '/{id}'
        }

        this.#swaggerPath = value;
    }

    get path() {
        let path = super.path;
        if (typeof path !== 'string') return path;
        if (this.#addId) {
            path += path.endsWith('/') ? ':id' : '/:id';
        }
        return path;
    }

    set path(path: string | RegExp) {
        super.path = path;
    }
}
