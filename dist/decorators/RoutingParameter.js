"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Next = exports.Response = exports.Res = exports.Request = exports.Req = exports.ReqHeader = exports.ReqParam = exports.ReqParams = exports.ReqQuery = exports.ReqBody = exports.ReqUser = exports.NotoresApp = exports.NApp = exports.NotoresConfig = exports.NConfig = exports.ResLocals = exports.registerRoutingParameterDecorator = exports.routingParameterDecorators = exports.addRoutingParameterDecoratorToFunction = exports.addRoutingParameterDecoratorInfoToSwagger = exports.generateRoutingParameters = exports.ParamTypes = void 0;
require("reflect-metadata");
const symbols_1 = require("../symbols");
const lib_1 = require("../lib");
var ParamTypes;
(function (ParamTypes) {
    ParamTypes["int"] = "int";
    ParamTypes["integer"] = "int";
    ParamTypes["float"] = "float";
    ParamTypes["bool"] = "boolean";
    ParamTypes["boolean"] = "boolean";
})(ParamTypes = exports.ParamTypes || (exports.ParamTypes = {}));
function generateRoutingParameters(instance, pathRouteMethod, req, res, next) {
    var _a;
    const params = [];
    let existingApiDecorators = (_a = Reflect.getOwnMetadata(symbols_1.apiParameterMetadataKey, instance[pathRouteMethod])) !== null && _a !== void 0 ? _a : [];
    existingApiDecorators.forEach((apiDecoratorInfo) => {
        const dec = exports.routingParameterDecorators.find((dec) => dec.type === apiDecoratorInfo.type);
        if (!dec)
            return;
        params[apiDecoratorInfo.index] = dec.cb(apiDecoratorInfo, req, res, next);
    });
    params.push(req);
    params.push(res);
    params.push(next);
    return params;
}
exports.generateRoutingParameters = generateRoutingParameters;
function addRoutingParameterDecoratorInfoToSwagger(type, target, propertyKey, index) {
    let reflectParamType = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    let paramType = reflectParamType[index];
    if (!(0, lib_1.isClassType)(paramType))
        return;
    const apiMetadata = lib_1.ApiMetaData.getApiMetaData(target, propertyKey);
    switch (type) {
        case 'requestBody':
            if ((0, lib_1.isClassType)(paramType))
                apiMetadata.requestBody = paramType;
            break;
        case 'query':
            if ((0, lib_1.isPrimitiveNonArrayType)(paramType))
                apiMetadata.addSwaggerQueryParameter((0, lib_1.getFunctionParamName)(target[propertyKey], index), paramType);
            break;
    }
    apiMetadata.save();
}
exports.addRoutingParameterDecoratorInfoToSwagger = addRoutingParameterDecoratorInfoToSwagger;
function addRoutingParameterDecoratorToFunction(type, target, propertyKey, index, data) {
    var _a;
    let existingApiDecorators = (_a = Reflect.getOwnMetadata(symbols_1.apiParameterMetadataKey, target[propertyKey])) !== null && _a !== void 0 ? _a : [];
    const apiDecoratorInfo = {
        type,
        index,
        data,
        paramName: (0, lib_1.getFunctionParamName)(target[propertyKey], index),
    };
    let reflectParamType = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    let paramType = reflectParamType[index];
    switch (type) {
        case 'body':
            if ((0, lib_1.isClassType)(paramType))
                apiDecoratorInfo.clazz = paramType;
            break;
        case 'query':
            if ((0, lib_1.isPrimitiveNonArrayType)(paramType) && typeof paramType === 'function') {
                apiDecoratorInfo.primitiveDataType = paramType;
            }
    }
    existingApiDecorators.push(apiDecoratorInfo);
    Reflect.defineMetadata(symbols_1.apiParameterMetadataKey, existingApiDecorators, target[propertyKey]);
}
exports.addRoutingParameterDecoratorToFunction = addRoutingParameterDecoratorToFunction;
exports.routingParameterDecorators = [];
function registerRoutingParameterDecorator(type, cb) {
    exports.routingParameterDecorators.push({ type, cb });
}
exports.registerRoutingParameterDecorator = registerRoutingParameterDecorator;
registerRoutingParameterDecorator('locals', ({ data }, req, res) => res.locals);
registerRoutingParameterDecorator('config', ({ data }, req) => req.config);
registerRoutingParameterDecorator('notores', ({ data }, req) => req.notores);
registerRoutingParameterDecorator('user', ({ data }, req) => req.user);
registerRoutingParameterDecorator('body', ({ data, clazz }, req) => {
    const body = req.body;
    if ((0, lib_1.isClassType)(clazz) && !Array.isArray(body) && typeof body === 'object') {
        return Object.setPrototypeOf(Object.assign({}, body), clazz.prototype);
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
function ResLocals(target, key, index) {
    addRoutingParameterDecoratorToFunction('locals', target, key, index);
}
exports.ResLocals = ResLocals;
function NConfig(target, key, index) {
    addRoutingParameterDecoratorToFunction('config', target, key, index);
}
exports.NConfig = NConfig;
function NotoresConfig(target, key, index) {
    addRoutingParameterDecoratorToFunction('config', target, key, index);
}
exports.NotoresConfig = NotoresConfig;
function NApp(target, key, index) {
    addRoutingParameterDecoratorToFunction('notores', target, key, index);
}
exports.NApp = NApp;
function NotoresApp(target, key, index) {
    addRoutingParameterDecoratorToFunction('notores', target, key, index);
}
exports.NotoresApp = NotoresApp;
function ReqUser(target, key, index) {
    addRoutingParameterDecoratorToFunction('user', target, key, index);
}
exports.ReqUser = ReqUser;
function ReqBody(target, key, index) {
    addRoutingParameterDecoratorInfoToSwagger('requestBody', target, key, index);
    addRoutingParameterDecoratorToFunction('body', target, key, index);
}
exports.ReqBody = ReqBody;
function ReqQuery(target, key, index) {
    addRoutingParameterDecoratorInfoToSwagger('query', target, key, index);
    addRoutingParameterDecoratorToFunction('query', target, key, index);
}
exports.ReqQuery = ReqQuery;
function ReqParams(target, key, index) {
    addRoutingParameterDecoratorToFunction('params', target, key, index);
}
exports.ReqParams = ReqParams;
function ReqParam(paramKey, type) {
    return (target, key, index) => {
        addRoutingParameterDecoratorToFunction('param', target, key, index, { key: paramKey, type });
    };
}
exports.ReqParam = ReqParam;
function ReqHeader(headerKey, type) {
    return (target, key, index) => {
        addRoutingParameterDecoratorToFunction('header', target, key, index, { key: headerKey, type });
    };
}
exports.ReqHeader = ReqHeader;
function Req(target, key, index) {
    addRoutingParameterDecoratorToFunction('request', target, key, index);
}
exports.Req = Req;
function Request(target, key, index) {
    addRoutingParameterDecoratorToFunction('request', target, key, index);
}
exports.Request = Request;
function Res(target, key, index) {
    addRoutingParameterDecoratorToFunction('response', target, key, index);
}
exports.Res = Res;
function Response(target, key, index) {
    addRoutingParameterDecoratorToFunction('response', target, key, index);
}
exports.Response = Response;
function Next(target, key, index) {
    addRoutingParameterDecoratorToFunction('next', target, key, index);
}
exports.Next = Next;
