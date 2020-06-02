"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.param = exports.params = exports.query = exports.body = exports.user = exports.ParamTypes = void 0;
const symbols_1 = require("../symbols");
var ParamTypes;
(function (ParamTypes) {
    ParamTypes["int"] = "int";
    ParamTypes["integer"] = "int";
    ParamTypes["float"] = "float";
    ParamTypes["bool"] = "boolean";
    ParamTypes["boolean"] = "boolean";
})(ParamTypes = exports.ParamTypes || (exports.ParamTypes = {}));
function addApiDecoratorToFunction(type, target, key, index, data) {
    var _a;
    let existingApiDecorators = (_a = Reflect.getOwnMetadata(symbols_1.apiParameterMetadataKey, target[key])) !== null && _a !== void 0 ? _a : [];
    existingApiDecorators.push({ type, index, data });
    Reflect.defineMetadata(symbols_1.apiParameterMetadataKey, existingApiDecorators, target[key]);
}
function user(target, key, index) {
    addApiDecoratorToFunction('user', target, key, index);
}
exports.user = user;
function body(target, key, index) {
    addApiDecoratorToFunction('body', target, key, index);
}
exports.body = body;
function query(target, key, index) {
    addApiDecoratorToFunction('query', target, key, index);
}
exports.query = query;
function params(target, key, index) {
    addApiDecoratorToFunction('params', target, key, index);
}
exports.params = params;
function param(key, type) {
    return (target, key, index) => {
        addApiDecoratorToFunction('param', target, key, index, { key, type });
    };
}
exports.param = param;
