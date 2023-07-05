import {ApiMetaData, HttpMethod} from "../ApiMetaData";
import {apiMetadataKey, moduleMetadataKey} from "../../symbols";
import {NextFunction, Request, Response} from "express";
import {generateRoutingParameters} from "../../decorators";
import {setBody} from "./helpers";
import {ModuleMetaData} from "../ModuleMetaData";
import {BindPath, BindPaths, BindSwaggerDoc} from "./types";


export function bindPaths({
                              pathRouteMethods,
                              ...restInput
                          }: BindPaths) {
    pathRouteMethods.forEach(pathRouteMethod => bindPath({
        pathRouteMethod,
        ...restInput
    }));
}


function bindSwaggerDoc({
                            operations,
                            apiMetaData,
                            route,
                        }: BindSwaggerDoc) {
    const method = apiMetaData.method;
    const swaggerDoc = apiMetaData.swaggerDoc;
    const path = typeof route === 'string' ? route : route.toString();

    const swaggerPathDoc = {
        [method]: swaggerDoc
    }
    if (operations[path]) {
        Object.assign(operations[path], swaggerPathDoc)
        return;
    }
    operations[path] = swaggerPathDoc;
}


function bindPath({
                      instance,
                      Clazz,
                      mod,
                      server,
                      pathRouteMethod,
                      operations,
                  }: BindPath) {
    const moduleMetaData: ModuleMetaData = Reflect.getOwnMetadata(moduleMetadataKey, Clazz);

    const apiMetaData: ApiMetaData = Reflect.getOwnMetadata(apiMetadataKey, instance[pathRouteMethod]);

    function wrapperMiddleware(routingFunction: any) {
        return async function routeWrapper(req: Request, res: Response, next: NextFunction) {
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
        }
    };

    const app = server[apiMetaData.restricted ? 'restricted' : 'public'].main;

    const preMiddlewares: Function[] = [];
    const postMiddlewares: Function[] = [];

    if (apiMetaData.accepts) {
        preMiddlewares.push(function acceptsCheckMiddleware(req: Request, res: Response, next: NextFunction) {
            if (req.accepts(apiMetaData.accepts) === false) {
                return next('route');
            }
            next();
        })
    }

    if (apiMetaData.authenticated) {
        preMiddlewares.push(
            (req: Request, res: Response, next: NextFunction) => {
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
                    if (req.user!.roles!.length === 0) {
                        return next('route');
                    }

                    return next(apiMetaData.isAuthorized(req.user!.roles!) ? '' : 'route');
                } else {
                    return next();
                }
            }
        )
    }

    if (apiMetaData.contentType) {
        preMiddlewares.push((req: Request, res: Response, next: NextFunction) => {
            res.locals.contentType = [apiMetaData.contentType];
            next();
        });
    }

    /** add developer defined middleware to default checking middleware **/
    function addMiddleware(value: string | string[] | Function | Function[], middlewareArray: Function[]) {
        if (!value)
            return;
        if (Array.isArray(value)) {
            value.forEach((val: string | Function) => {
                middlewareArray.push(
                    (typeof val === 'string') ?
                        instance[val].bind(instance) :
                        val
                )
            })
        } else {
            middlewareArray.push(
                (typeof value === 'string') ?
                    instance[value].bind(instance) :
                    value
            )
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

    app[apiMetaData.method](
        apiMetaData.path,
        preMiddlewares,
        wrapperMiddleware(
            instance[pathRouteMethod].bind(instance)
        ),
        postMiddlewares,
    );

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
        })
}