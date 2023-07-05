import 'reflect-metadata';
import { apiParameterMetadataKey } from "../symbols";
import { ApiMetaData, getFunctionParamName, isClassType, isPrimitiveNonArrayType } from "../lib";
export var ParamTypes;
(function (ParamTypes) {
    ParamTypes["int"] = "int";
    ParamTypes["integer"] = "int";
    ParamTypes["float"] = "float";
    ParamTypes["bool"] = "boolean";
    ParamTypes["boolean"] = "boolean";
})(ParamTypes || (ParamTypes = {}));
export function generateRoutingParameters(instance, pathRouteMethod, req, res, next) {
    const params = [];
    let existingApiDecorators = Reflect.getOwnMetadata(apiParameterMetadataKey, instance[pathRouteMethod]) ?? [];
    existingApiDecorators.forEach((apiDecoratorInfo) => {
        const dec = routingParameterDecorators.find((dec) => dec.type === apiDecoratorInfo.type);
        if (!dec)
            return;
        params[apiDecoratorInfo.index] = dec.cb(apiDecoratorInfo, req, res, next);
    });
    params.push(req);
    params.push(res);
    params.push(next);
    return params;
}
export function addRoutingParameterDecoratorInfoToSwagger(type, target, propertyKey, index) {
    let reflectParamType = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    let paramType = reflectParamType[index];
    if (!isClassType(paramType))
        return;
    const apiMetadata = ApiMetaData.getApiMetaData(target, propertyKey);
    switch (type) {
        case 'requestBody':
            if (isClassType(paramType))
                apiMetadata.requestBody = paramType;
            break;
        case 'query':
            if (isPrimitiveNonArrayType(paramType))
                apiMetadata.addSwaggerQueryParameter(getFunctionParamName(target[propertyKey], index), paramType);
            break;
    }
    apiMetadata.save();
}
export function addRoutingParameterDecoratorToFunction(type, target, propertyKey, index, data) {
    let existingApiDecorators = Reflect.getOwnMetadata(apiParameterMetadataKey, target[propertyKey]) ?? [];
    const apiDecoratorInfo = {
        type,
        index,
        data,
        paramName: getFunctionParamName(target[propertyKey], index),
    };
    let reflectParamType = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    let paramType = reflectParamType[index];
    switch (type) {
        case 'body':
            if (isClassType(paramType))
                apiDecoratorInfo.clazz = paramType;
            break;
        case 'query':
            if (isPrimitiveNonArrayType(paramType) && typeof paramType === 'function') {
                apiDecoratorInfo.primitiveDataType = paramType;
            }
    }
    existingApiDecorators.push(apiDecoratorInfo);
    Reflect.defineMetadata(apiParameterMetadataKey, existingApiDecorators, target[propertyKey]);
}
export const routingParameterDecorators = [];
export function registerRoutingParameterDecorator(type, cb) {
    routingParameterDecorators.push({ type, cb });
}
registerRoutingParameterDecorator('locals', ({ data }, req, res) => res.locals);
registerRoutingParameterDecorator('config', ({ data }, req) => req.config);
registerRoutingParameterDecorator('notores', ({ data }, req) => req.notores);
registerRoutingParameterDecorator('user', ({ data }, req) => req.user);
registerRoutingParameterDecorator('body', ({ data, clazz }, req) => {
    const body = req.body;
    if (isClassType(clazz) && !Array.isArray(body) && typeof body === 'object') {
        return Object.setPrototypeOf({ ...body }, clazz.prototype);
    }
    return body;
});
registerRoutingParameterDecorator('query', ({ data, paramName, primitiveDataType }, req) => {
    if (!req.query)
        return req.query;
    if (primitiveDataType) {
        const data = req.query[paramName];
        if (!data)
            return null;
        return primitiveDataType(req.query[paramName]);
    }
    return req.query;
});
registerRoutingParameterDecorator('params', ({ data }, req) => req.params);
registerRoutingParameterDecorator('param', ({ data }, req) => {
    let val = req.params[data.key];
    if (data.type) {
        switch (data.type) {
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
registerRoutingParameterDecorator('header', ({ data }, req) => req.headers[data.key]);
registerRoutingParameterDecorator('request', ({ data }, req) => req);
registerRoutingParameterDecorator('response', ({ data }, req, res) => res);
registerRoutingParameterDecorator('next', ({ data }, req, res, next) => next);
export function ResLocals(target, key, index) {
    addRoutingParameterDecoratorToFunction('locals', target, key, index);
}
export function NConfig(target, key, index) {
    addRoutingParameterDecoratorToFunction('config', target, key, index);
}
export function NotoresConfig(target, key, index) {
    addRoutingParameterDecoratorToFunction('config', target, key, index);
}
export function NApp(target, key, index) {
    addRoutingParameterDecoratorToFunction('notores', target, key, index);
}
export function NotoresApp(target, key, index) {
    addRoutingParameterDecoratorToFunction('notores', target, key, index);
}
export function ReqUser(target, key, index) {
    addRoutingParameterDecoratorToFunction('user', target, key, index);
}
export function ReqBody(target, key, index) {
    addRoutingParameterDecoratorInfoToSwagger('requestBody', target, key, index);
    addRoutingParameterDecoratorToFunction('body', target, key, index);
}
export function ReqQuery(target, key, index) {
    addRoutingParameterDecoratorInfoToSwagger('query', target, key, index);
    addRoutingParameterDecoratorToFunction('query', target, key, index);
}
export function ReqParams(target, key, index) {
    addRoutingParameterDecoratorToFunction('params', target, key, index);
}
export function ReqParam(paramKey, type) {
    return (target, key, index) => {
        addRoutingParameterDecoratorToFunction('param', target, key, index, { key: paramKey, type });
    };
}
export function ReqHeader(headerKey, type) {
    return (target, key, index) => {
        addRoutingParameterDecoratorToFunction('header', target, key, index, { key: headerKey, type });
    };
}
export function Req(target, key, index) {
    addRoutingParameterDecoratorToFunction('request', target, key, index);
}
export function Request(target, key, index) {
    addRoutingParameterDecoratorToFunction('request', target, key, index);
}
export function Res(target, key, index) {
    addRoutingParameterDecoratorToFunction('response', target, key, index);
}
export function Response(target, key, index) {
    addRoutingParameterDecoratorToFunction('response', target, key, index);
}
export function Next(target, key, index) {
    addRoutingParameterDecoratorToFunction('next', target, key, index);
}
