"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Use = void 0;
const MiddlewareMetaData_1 = __importDefault(require("../lib/MiddlewareMetaData"));
const symbols_1 = require("../symbols");
function Use(middlewares) {
    return (target, propertyKey) => {
        var _a;
        const existingMiddlewareMetadata = (_a = Reflect.getOwnMetadata(symbols_1.middlewareMetadataKey, target[propertyKey])) !== null && _a !== void 0 ? _a : new MiddlewareMetaData_1.default(target, propertyKey);
        if (middlewares) {
            if (typeof middlewares === 'object') {
                if (middlewares.hasOwnProperty('pre'))
                    existingMiddlewareMetadata.isPreMiddleware = middlewares.pre;
                if (middlewares.hasOwnProperty('post'))
                    existingMiddlewareMetadata.isPostMiddleware = middlewares.post;
                if (middlewares.paths)
                    existingMiddlewareMetadata.setPaths(middlewares.paths);
            }
            else {
                existingMiddlewareMetadata.setPaths(middlewares);
            }
        }
        Reflect.defineMetadata(symbols_1.middlewareMetadataKey, existingMiddlewareMetadata, target[propertyKey]);
    };
}
exports.Use = Use;
