"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RoutingMetadata_1 = __importDefault(require("./RoutingMetadata"));
class MiddlewareMetaData extends RoutingMetadata_1.default {
    constructor(target, propertyKey) {
        super(target, propertyKey);
        this._isPreMiddleware = true;
        this._isPostMiddleware = false;
    }
    set isPreMiddleware(isPre) {
        this._isPreMiddleware = isPre;
    }
    get isPreMiddleware() {
        return this._isPreMiddleware;
    }
    set isPostMiddleware(isPost) {
        this._isPostMiddleware = isPost;
    }
    get isPostMiddleware() {
        return this._isPostMiddleware;
    }
}
exports.default = MiddlewareMetaData;
