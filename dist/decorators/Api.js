"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.next = exports.response = exports.request = exports.param = exports.params = exports.query = exports.body = exports.user = exports.config = exports.registerRoutingParameterDecorator = exports.routingParameterDecorators = exports.addRoutingParameterDecoratorToFunction = exports.generateRoutingParameters = exports.ParamTypes = void 0;
const symbols_1 = require("../symbols");
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
    existingApiDecorators.forEach((d) => {
        const dec = exports.routingParameterDecorators.find((dec) => dec.type === d.type);
        if (!dec)
            return;
        params[d.index] = dec.cb(d.data, req, res, next);
    });
    params.push(req);
    params.push(res);
    params.push(next);
    return params;
}
exports.generateRoutingParameters = generateRoutingParameters;
function addRoutingParameterDecoratorToFunction(type, target, key, index, data) {
    var _a;
    let existingApiDecorators = (_a = Reflect.getOwnMetadata(symbols_1.apiParameterMetadataKey, target[key])) !== null && _a !== void 0 ? _a : [];
    existingApiDecorators.push({ type, index, data });
    Reflect.defineMetadata(symbols_1.apiParameterMetadataKey, existingApiDecorators, target[key]);
}
exports.addRoutingParameterDecoratorToFunction = addRoutingParameterDecoratorToFunction;
exports.routingParameterDecorators = [];
function registerRoutingParameterDecorator(type, cb) {
    exports.routingParameterDecorators.push({ type, cb });
}
exports.registerRoutingParameterDecorator = registerRoutingParameterDecorator;
registerRoutingParameterDecorator('config', (data, req) => req.notores);
registerRoutingParameterDecorator('user', (data, req) => req.user);
registerRoutingParameterDecorator('body', (data, req) => req.body);
registerRoutingParameterDecorator('query', (data, req) => req.query);
registerRoutingParameterDecorator('params', (data, req) => req.params);
registerRoutingParameterDecorator('param', (data, req) => {
    let val = req.params[data.key];
    if (data.type) {
        switch (data.type) {
            case ParamTypes.int:
            case ParamTypes.integer:
                val = parseInt(val);
                break;
            case ParamTypes.float:
                val = parseFloat(val);
                break;
            case ParamTypes.bool:
            case ParamTypes.boolean:
                val = !!val;
                break;
        }
    }
    return val;
});
registerRoutingParameterDecorator('request', (data, req) => req);
registerRoutingParameterDecorator('response', (data, req, res) => res);
registerRoutingParameterDecorator('next', (data, req, res, next) => next);
function config(target, key, index) {
    addRoutingParameterDecoratorToFunction('config', target, key, index);
}
exports.config = config;
function user(target, key, index) {
    addRoutingParameterDecoratorToFunction('user', target, key, index);
}
exports.user = user;
function body(target, key, index) {
    addRoutingParameterDecoratorToFunction('body', target, key, index);
}
exports.body = body;
function query(target, key, index) {
    addRoutingParameterDecoratorToFunction('query', target, key, index);
}
exports.query = query;
function params(target, key, index) {
    addRoutingParameterDecoratorToFunction('params', target, key, index);
}
exports.params = params;
function param(paramKey, type) {
    return (target, key, index) => {
        addRoutingParameterDecoratorToFunction('param', target, key, index, { key: paramKey, type });
    };
}
exports.param = param;
function request(target, key, index) {
    addRoutingParameterDecoratorToFunction('request', target, key, index);
}
exports.request = request;
function response(target, key, index) {
    addRoutingParameterDecoratorToFunction('response', target, key, index);
}
exports.response = response;
function next(target, key, index) {
    addRoutingParameterDecoratorToFunction('next', target, key, index);
}
exports.next = next;
