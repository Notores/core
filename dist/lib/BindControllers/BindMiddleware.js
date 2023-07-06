"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindMiddlewares = void 0;
const symbols_1 = require("../../symbols");
const decorators_1 = require("../../decorators");
const helpers_1 = require("./helpers");
function bindMiddlewares(_a) {
    var { middlewareDeclarationMethods } = _a, restInput = __rest(_a, ["middlewareDeclarationMethods"]);
    middlewareDeclarationMethods.forEach(middlewareDeclarationMethod => bindMiddleware(Object.assign({ middlewareDeclarationMethod }, restInput)));
}
exports.bindMiddlewares = bindMiddlewares;
function bindMiddleware({ instance, Clazz, mod, middlewareDeclarationMethod, server }) {
    const moduleMetaData = Reflect.getOwnMetadata(symbols_1.moduleMetadataKey, Clazz);
    const middlewareMetaData = Reflect.getOwnMetadata(symbols_1.middlewareMetadataKey, instance[middlewareDeclarationMethod]);
    const wrapperMiddleware = (routingFunction) => {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const useAuthentication = req.config.authentication.enabled;
            if (useAuthentication && middlewareMetaData.authenticated && !req.user) {
                return next();
            }
            const params = (0, decorators_1.generateRoutingParameters)(instance, middlewareDeclarationMethod, req, res, next);
            const result = yield routingFunction(...params);
            if (result) {
                res.locals.setBody((0, helpers_1.setBody)(result, moduleMetaData));
            }
            next();
        });
    };
    const app = server[middlewareMetaData.restricted ? 'restricted' : 'public'];
    const mids = [];
    const midsObj = {
        METHOD: 'use',
        ROUTE: middlewareMetaData.path,
        RESTRICTED: middlewareMetaData.restricted,
        AUTH: middlewareMetaData.authenticated,
        AUTH_REDIRECT: middlewareMetaData.unAuthRedirect,
        ROLES: middlewareMetaData.roles,
        FUNC: middlewareDeclarationMethod,
    };
    if (!['', '/'].includes(middlewareMetaData.path.toString())) {
        mids.push(middlewareMetaData.path);
    }
    else {
        midsObj.ROUTE = ['ALL'];
    }
    mids.push(wrapperMiddleware(instance[middlewareDeclarationMethod].bind(instance)));
    mod.routes.push(midsObj);
    if (middlewareMetaData.isPreMiddleware) {
        app.preMiddleware.use(...mids);
    }
    if (middlewareMetaData.isPostMiddleware) {
        app.postMiddleware.use(...mids);
    }
}
