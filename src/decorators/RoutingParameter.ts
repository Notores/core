import 'reflect-metadata';
import {apiParameterMetadataKey} from "../symbols";
import {NextFunction, Request, Response} from 'express';
import {ApiMetaData, getFunctionParamName, isClassType, isPrimitiveNonArrayType} from "../lib";
import {ClassType} from "../types/Notores";

export enum ParamTypes {
    int = 'int',
    integer = 'int',
    float = 'float',
    bool = 'boolean',
    boolean = 'boolean',
}

export type ApiDecoratorInfo = {
    type: string,
    index: number,
    paramName: string,
    data?: Record<string, any>,
    clazz?: ClassType,
    primitiveDataType?: Function,
}

export function generateRoutingParameters(instance: any, pathRouteMethod: string, req: Request, res: Response, next: NextFunction) {
    const params = [];
    let existingApiDecorators = Reflect.getOwnMetadata(apiParameterMetadataKey, instance[pathRouteMethod]) ?? [];
    existingApiDecorators.forEach((apiDecoratorInfo: ApiDecoratorInfo) => {
        const dec = routingParameterDecorators.find((dec) => dec.type === apiDecoratorInfo.type)

        if (!dec)
            return;

        params[apiDecoratorInfo.index] = dec.cb(apiDecoratorInfo, req, res, next);
    });

    params.push(req);
    params.push(res);
    params.push(next);
    return params;
}

export function addRoutingParameterDecoratorInfoToSwagger(type: string, target: any, propertyKey: string, index: number) {
    let reflectParamType = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    let paramType = reflectParamType[index];
    if (!isClassType(paramType)) return;

    const apiMetadata: ApiMetaData = ApiMetaData.getApiMetaData(target, propertyKey);
    switch (type) {
        case 'requestBody':
            if (isClassType(paramType)) apiMetadata.requestBody = paramType;
            break;
        case 'query':
            if (isPrimitiveNonArrayType(paramType)) apiMetadata.addSwaggerQueryParameter(getFunctionParamName(target[propertyKey], index), paramType);
            break;

    }

    apiMetadata.save();
}

export function addRoutingParameterDecoratorToFunction(type: string, target: any, propertyKey: string, index: number, data?: object) {
    let existingApiDecorators = Reflect.getOwnMetadata(apiParameterMetadataKey, target[propertyKey]) ?? [];

    const apiDecoratorInfo: ApiDecoratorInfo = {
        type,
        index,
        data,
        paramName: getFunctionParamName(target[propertyKey], index),
    };
    let reflectParamType = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    let paramType = reflectParamType[index];

    switch (type) {
        case 'body':
            if (isClassType(paramType)) apiDecoratorInfo.clazz = paramType;
            break;
        case 'query':
            if (isPrimitiveNonArrayType(paramType) && typeof paramType === 'function') {
                apiDecoratorInfo.primitiveDataType = paramType;
            }
    }

    existingApiDecorators.push(apiDecoratorInfo);

    Reflect.defineMetadata(apiParameterMetadataKey, existingApiDecorators, target[propertyKey]);
}

export const routingParameterDecorators: Array<{ type: string, cb: Function }> = [];

export function registerRoutingParameterDecorator(type: string, cb: Function) {
    routingParameterDecorators.push({type, cb})
}

registerRoutingParameterDecorator('locals', ({data}: ApiDecoratorInfo, req: Request, res: Response) => res.locals);

registerRoutingParameterDecorator('config', ({data}: ApiDecoratorInfo, req: Request) => req.config);

registerRoutingParameterDecorator('notores', ({data}: ApiDecoratorInfo, req: Request) => req.notores);

registerRoutingParameterDecorator('user', ({data}: ApiDecoratorInfo, req: Request) => req.user);

registerRoutingParameterDecorator('body', ({data, clazz}: ApiDecoratorInfo, req: Request) => {
    const body = req.body;
    if (isClassType(clazz) && !Array.isArray(body) && typeof body === 'object') {
        return Object.setPrototypeOf({...body}, clazz.prototype);
    }

    return body
});

registerRoutingParameterDecorator('query', ({data, paramName, primitiveDataType}: ApiDecoratorInfo, req: Request) => {
    if (!req.query) return req.query;

    if (primitiveDataType) {
        const data = req.query[paramName];
        if (!data) return null;

        return primitiveDataType(req.query[paramName])
    }

    return req.query
});

registerRoutingParameterDecorator('params', ({data}: ApiDecoratorInfo, req: Request) => req.params);

registerRoutingParameterDecorator('param', ({data}: ApiDecoratorInfo, req: Request) => {
    let val: any = req.params[data!.key]
    if (data!.type) {
        switch (data!.type) {
            case ParamTypes.int || ParamTypes.integer:
                val = parseInt(val);
                break;
            case ParamTypes.float:
                val = parseFloat(val);
                break;
            case ParamTypes.bool || ParamTypes.boolean:
                val = !!val;
                break;
        }
    }

    return val;
});

registerRoutingParameterDecorator('header', ({data}: ApiDecoratorInfo, req: Request) => req.headers[data!.key]);

registerRoutingParameterDecorator('request', ({data}: ApiDecoratorInfo, req: Request) => req);

registerRoutingParameterDecorator('response', ({data}: ApiDecoratorInfo, req: Request, res: Response) => res);

registerRoutingParameterDecorator('next', ({data}: ApiDecoratorInfo, req: Request, res: Response, next: NextFunction) => next);

export function ResLocals(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('locals', target, key, index);
}

export function NConfig(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('config', target, key, index);
}

export function NotoresConfig(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('config', target, key, index);
}

export function NApp(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('notores', target, key, index);
}

export function NotoresApp(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('notores', target, key, index);
}

export function ReqUser(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('user', target, key, index);
}

export function ReqBody(target: any, key: string, index: number) {
    addRoutingParameterDecoratorInfoToSwagger('requestBody', target, key, index)
    addRoutingParameterDecoratorToFunction('body', target, key, index);
}

export function ReqQuery(target: any, key: string, index: number) {
    addRoutingParameterDecoratorInfoToSwagger('query', target, key, index);
    addRoutingParameterDecoratorToFunction('query', target, key, index);
}

export function ReqParams(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('params', target, key, index);
}

export function ReqParam(paramKey: string, type?: ParamTypes) {
    return (target: any, key: string, index: number) => {
        addRoutingParameterDecoratorToFunction('param', target, key, index, {key: paramKey, type});
    }
}
export function ReqHeader(headerKey: string, type?: ParamTypes) {
    return (target: any, key: string, index: number) => {
        addRoutingParameterDecoratorToFunction('header', target, key, index, {key: headerKey, type});
    }
}

export function Req(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('request', target, key, index);
}

export function Request(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('request', target, key, index);
}

export function Res(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('response', target, key, index);
}

export function Response(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('response', target, key, index);
}

export function Next(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('next', target, key, index);
}
