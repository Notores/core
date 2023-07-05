import { HttpMethod } from "../ApiMetaData";
import { apiMetadataKey, moduleMetadataKey } from "../../symbols";
import { generateRoutingParameters } from "../../decorators";
import { setBody } from "./helpers";
export function bindPaths({ pathRouteMethods, ...restInput }) {
    pathRouteMethods.forEach(pathRouteMethod => bindPath({
        pathRouteMethod,
        ...restInput
    }));
}
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
    const moduleMetaData = Reflect.getOwnMetadata(moduleMetadataKey, Clazz);
    const apiMetaData = Reflect.getOwnMetadata(apiMetadataKey, instance[pathRouteMethod]);
    function wrapperMiddleware(routingFunction) {
        return async function routeWrapper(req, res, next) {
            const params = generateRoutingParameters(instance, pathRouteMethod, req, res, next);
            const result = await routingFunction(...params);
            if (result === null || result === undefined) {
                return next();
            }
            res.locals.setBody(setBody(result, moduleMetaData));
            if (apiMetaData.method === HttpMethod.POST && !(result instanceof Error)) {
                res.locals.statusCode = 201;
            }
            next();
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
