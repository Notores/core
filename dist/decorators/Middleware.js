"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Use = void 0;
const lib_1 = require("../lib");
const symbols_1 = require("../symbols");
function Use(middlewares) {
    return (target, propertyKey) => {
        var _a;
        const existingMiddlewareMetadata = (_a = Reflect.getOwnMetadata(symbols_1.middlewareMetadataKey, target[propertyKey])) !== null && _a !== void 0 ? _a : new lib_1.MiddlewareMetaData(target, propertyKey);
        if (middlewares) {
            if (typeof middlewares === 'object') {
                if (middlewares.hasOwnProperty('pre'))
                    existingMiddlewareMetadata.isPreMiddleware = middlewares.pre;
                if (middlewares.hasOwnProperty('post'))
                    existingMiddlewareMetadata.isPostMiddleware = middlewares.post;
                if (middlewares.path)
                    existingMiddlewareMetadata.path = middlewares.path;
            }
            else {
                existingMiddlewareMetadata.path = middlewares;
            }
        }
        Reflect.defineMetadata(symbols_1.middlewareMetadataKey, existingMiddlewareMetadata, target[propertyKey]);
    };
}
exports.Use = Use;
