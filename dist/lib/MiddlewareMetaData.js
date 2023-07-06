"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _MiddlewareMetaData_isPreMiddleware, _MiddlewareMetaData_isPostMiddleware;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareMetaData = void 0;
const RoutingMetadata_1 = __importDefault(require("./RoutingMetadata"));
class MiddlewareMetaData extends RoutingMetadata_1.default {
    constructor(target, propertyKey) {
        super(target, propertyKey);
        _MiddlewareMetaData_isPreMiddleware.set(this, true);
        _MiddlewareMetaData_isPostMiddleware.set(this, false);
    }
    set isPreMiddleware(isPre) {
        __classPrivateFieldSet(this, _MiddlewareMetaData_isPreMiddleware, isPre, "f");
    }
    get isPreMiddleware() {
        return __classPrivateFieldGet(this, _MiddlewareMetaData_isPreMiddleware, "f");
    }
    set isPostMiddleware(isPost) {
        __classPrivateFieldSet(this, _MiddlewareMetaData_isPostMiddleware, isPost, "f");
    }
    get isPostMiddleware() {
        return __classPrivateFieldGet(this, _MiddlewareMetaData_isPostMiddleware, "f");
    }
}
exports.MiddlewareMetaData = MiddlewareMetaData;
_MiddlewareMetaData_isPreMiddleware = new WeakMap(), _MiddlewareMetaData_isPostMiddleware = new WeakMap();
