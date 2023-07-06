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
exports.bindPaths = void 0;
const ApiMetaData_1 = require("../ApiMetaData");
const symbols_1 = require("../../symbols");
const decorators_1 = require("../../decorators");
const helpers_1 = require("./helpers");
function bindPaths(_a) {
    var { pathRouteMethods } = _a, restInput = __rest(_a, ["pathRouteMethods"]);
    pathRouteMethods.forEach(pathRouteMethod => bindPath(Object.assign({ pathRouteMethod }, restInput)));
}
exports.bindPaths = bindPaths;
function bindSwaggerDoc({ operations, apiMetaData, route, }) {
    const method = apiMetaData.method;
    const swaggerDoc = apiMetaData.swaggerDoc;
    const path = typeof route === 'string' ? route : route.toString();
    const swaggerPathDoc = {
        [method]: swaggerDoc
    };
    if (operations[path]) {
        Object.assign(operations[path], swaggerPathDoc);
        return;
    }
    operations[path] = swaggerPathDoc;
}
function bindPath({ instance, Clazz, mod, server, pathRouteMethod, operations, }) {
    const moduleMetaData = Reflect.getOwnMetadata(symbols_1.moduleMetadataKey, Clazz);
    const apiMetaData = Reflect.getOwnMetadata(symbols_1.apiMetadataKey, instance[pathRouteMethod]);
    function wrapperMiddleware(routingFunction) {
        return function routeWrapper(req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const params = (0, decorators_1.generateRoutingParameters)(instance, pathRouteMethod, req, res, next);
                const result = yield routingFunction(...params);
                if (result === null || result === undefined) {
                    return next();
                }
                res.locals.setBody((0, helpers_1.setBody)(result, moduleMetaData));
                if (apiMetaData.method === ApiMetaData_1.HttpMethod.POST && !(result instanceof Error)) {
                    res.locals.statusCode = 201;
                }
                next();
            });
        };
    }
    ;
    const app = server[apiMetaData.restricted ? 'restricted' : 'public'].main;
    const preMiddlewares = [];
    const postMiddlewares = [];
    if (apiMetaData.accepts) {
        preMiddlewares.push(function acceptsCheckMiddleware(req, res, next) {
            if (req.accepts(apiMetaData.accepts) === false) {
                return next('route');
            }
            next();
        });
    }
    if (apiMetaData.authenticated) {
        preMiddlewares.push((req, res, next) => {
            const useAuthentication = req.config.authentication.enabled;
            if (!useAuthentication)
                return next('route');
            if (!req.isAuthenticated()) {
                res.locals.statusCode = 403;
                res.locals.error = new Error('Not Authenticated');
                if (apiMetaData.unAuthRedirect) {
                    return next(res.locals.error);
                }
                return next('route');
            }
            if (apiMetaData.roles.length > 0) {
                if (req.user.roles.length === 0) {
                    return next('route');
                }
                return next(apiMetaData.isAuthorized(req.user.roles) ? '' : 'route');
            }
            else {
                return next();
            }
        });
    }
    if (apiMetaData.contentType) {
        preMiddlewares.push((req, res, next) => {
            res.locals.contentType = [apiMetaData.contentType];
            next();
        });
    }
    /** add developer defined middleware to default checking middleware **/
    function addMiddleware(value, middlewareArray) {
        if (!value)
            return;
        if (Array.isArray(value)) {
            value.forEach((val) => {
                middlewareArray.push((typeof val === 'string') ?
                    instance[val].bind(instance) :
                    val);
            });
        }
        else {
            middlewareArray.push((typeof value === 'string') ?
                instance[value].bind(instance) :
                value);
        }
    }
    addMiddleware(apiMetaData.preMiddlewares, preMiddlewares);
    addMiddleware(apiMetaData.postMiddlewares, postMiddlewares);
    mod.routes.push({
        METHOD: apiMetaData.method,
        ROUTE: apiMetaData.path,
        PRE_MIDDLE: preMiddlewares.length,
        POST_MIDDLE: postMiddlewares.length,
        RESTRICTED: apiMetaData.restricted,
        AUTH: apiMetaData.authenticated,
        AUTH_REDIRECT: apiMetaData.unAuthRedirect,
        ROLES: apiMetaData.roles,
        FUNC: pathRouteMethod,
    });
    if (preMiddlewares.length === 0) {
        preMiddlewares.push((req, res, next) => next());
    }
    if (postMiddlewares.length === 0) {
        postMiddlewares.push((req, res, next) => next());
    }
    app[apiMetaData.method](apiMetaData.path, preMiddlewares, wrapperMiddleware(instance[pathRouteMethod].bind(instance)), postMiddlewares);
    if (apiMetaData.addSwagger)
        bindSwaggerDoc({
            instance,
            Clazz,
            mod,
            server,
            operations,
            route: apiMetaData.swaggerPath,
            moduleMetaData,
            apiMetaData
        });
}
