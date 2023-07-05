import 'reflect-metadata';
import {NextFunction, Request, Response} from "express";
import {IServer} from "../interfaces/IServer";
import {join} from "path";
import {apiMetadataKey, middlewareMetadataKey, moduleMetadataKey} from "../symbols";
import {generateRoutingParameters} from "./Api";
import {getConfig} from "../lib/config";
import {NotoresApplication, SystemLogger} from "../Notores";
import ApiMetaData, {HttpMethod} from "../lib/ApiMetaData";
import MiddlewareMetaData from "../lib/MiddlewareMetaData";
import ModuleMetaData from "../lib/ModuleMetaData";
import {moduleLoggerFactory} from "../lib/logger";

export const paths: { [key: string]: any } = [];

function setBody(result: any, moduleMetaData: ModuleMetaData): any {
    if (moduleMetaData.responseIsBody) {
        return result;
    } else if (result instanceof Error) {
        return {error: result.message};
    } else if (typeof result === 'object' && !Array.isArray(result) && result.hasOwnProperty(moduleMetaData.dataKey as string)) {
        return result;
    } else {
        return {[moduleMetaData.dataKey as string]: result};
    }
}

/**
 * Attaches the router controllers to the main express application instance.
 * @param server - express application instance (result of call to `express()`)
 * @param controllers - controller classes (rest parameter) decorated with @Root and @Path/@Use
 */
export function bindControllers(server: IServer, controllers: Function[]) {
    const useAuthentication = getConfig().main.authentication.enabled;
    const ctrls = [];
    for (const Clazz of controllers) {
        const instance = new (<any>Clazz)();
        ctrls.push(instance);

        const moduleMetaData: ModuleMetaData = Reflect.getOwnMetadata(moduleMetadataKey, Clazz);
        /*
        if (!rootRoute || !rootRoute.startsWith('/')) {
            // TODO test it
            throw new Error('Class-level \'@Root\' decorator must be used with single string argument starting with forward slash (eg. \'/\' or \'/myRoot\')!');
        }
        */

        // @Use // DO THIS
        const middlewareDeclarationMethods = getClassMethodsByDecoratedProperty(Clazz, middlewareMetadataKey);
        middlewareDeclarationMethods.forEach(middlewareDeclarationMethod => {
            const middlewareMetaData: MiddlewareMetaData = Reflect.getOwnMetadata(middlewareMetadataKey, instance[middlewareDeclarationMethod]);

            const wrapperMiddleware = (routingFunction: any) => {
                return async (req: Request, res: Response, next: NextFunction) => {
                    if (useAuthentication && middlewareMetaData.authenticated && !req.user) {
                        return next();
                    }

                    const params = generateRoutingParameters(instance, middlewareDeclarationMethod, req, res, next);

                    const result = await routingFunction(...params);

                    if (result) {
                        res.locals.setBody(setBody(result, moduleMetaData));
                    }
                    next();
                }
            };

            const app = server[middlewareMetaData.restricted ? 'restricted' : 'public'];

            const mids = [];
            const midsObj = {
                method: 'use',
                ROUTE: middlewareMetaData.paths,
                PATH: '',
                RESTRICTED: middlewareMetaData.restricted,
                AUTH: middlewareMetaData.authenticated,
                AUTH_REDIRECT: middlewareMetaData.unAuthRedirect,
                ROLES: middlewareMetaData.roles,
                function: middlewareDeclarationMethod,
            }

            if (middlewareMetaData.paths.length > 0) {
                mids.push(middlewareMetaData.paths)
            } else {
                midsObj.ROUTE = ['ALL'];
            }

            mids.push(
                wrapperMiddleware(
                    instance[middlewareDeclarationMethod].bind(instance)
                )
            );

            paths.push(midsObj);

            if (middlewareMetaData.isPreMiddleware) {
                // @ts-ignore
                app.preMiddleware.use(...mids)
            }
            if (middlewareMetaData.isPostMiddleware) {
                // @ts-ignore
                app.postMiddleware.use(...mids);
            }
        });

        // @Path
        const pathRouteMethods = getClassMethodsByDecoratedProperty(Clazz, apiMetadataKey);

        pathRouteMethods.forEach(pathRouteMethod => {
            const apiMetaData: ApiMetaData = Reflect.getOwnMetadata(apiMetadataKey, instance[pathRouteMethod]);

            const wrapperMiddleware = (routingFunction: any) => {
                return async (req: Request, res: Response, next: NextFunction) => {
                    const params = generateRoutingParameters(instance, pathRouteMethod, req, res, next);

                    const result = await routingFunction(...params);

                    if (result === null || result === undefined) {
                        return next();
                    }

                    if (apiMetaData.pages) {
                        res.locals.addPageLocations([
                            join(moduleMetaData.filePath, 'pages')
                        ]);
                        res.locals.addPages(
                            apiMetaData.pages
                        );
                    }

                    res.locals.setBody(setBody(result, moduleMetaData));
                    next();
                }
            };

            // const {PATH_ROUTE, HTTP_METHOD, PRE_MIDDLEWARE, POST_MIDDLEWARE, PRIVATE, AUTH, AUTH_REDIRECT, ROLES, PAGE_GEN} = instance[pathRouteMethod];
            const app = server[apiMetaData.restricted ? 'restricted' : 'public'].router;

            const preMiddlewares: Function[] = [];
            const postMiddlewares: Function[] = [];

            if (apiMetaData.templateAccess) {
                NotoresApplication.app.apps.preMiddleware.use((req: Request, res: Response, next: NextFunction) => {
                    const params = generateRoutingParameters(instance, pathRouteMethod, req, res, next);
                    res.locals[apiMetaData.propertyKey] = instance[pathRouteMethod].bind(instance, ...params);
                    next();
                });
            }

            if (apiMetaData.accepts) {
                preMiddlewares.push(((req: Request, res: Response, next: NextFunction) => {
                    if (req.accepts(apiMetaData.accepts) === false) {
                        return next('route');
                    }
                    next();
                }))
            }

            if (useAuthentication && apiMetaData.authenticated) {
                preMiddlewares.push(
                    (req: Request, res: Response, next: NextFunction) => {
                        if (!req.isAuthenticated()) {
                            res.locals.error = {status: 403, message: 'Not Authenticated'};

                            if (apiMetaData.unAuthRedirect) {
                                res.status(res.locals.error.status);
                                if (res.locals.type === 'html') {
                                    res.redirect('/login');
                                } else {
                                    res.json(res.locals.error);
                                }
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
                    res.locals.type = apiMetaData.contentType;
                    next();
                });
            }

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

            const routes = moduleMetaData.prefix === '/' ? apiMetaData.paths : apiMetaData.paths.map((path: string | RegExp) => `${moduleMetaData.prefix}${path}`);

            paths.push({
                method: apiMetaData.method,
                ROUTE: apiMetaData.restricted ? routes.map((r: string | RegExp) => `/n-admin${r}`) : routes,
                PATH: apiMetaData.paths,
                PRE_MIDDLE: preMiddlewares.length,
                POST_MIDDLE: postMiddlewares.length,
                PAGES: apiMetaData.pages,
                RESTRICTED: apiMetaData.restricted,
                AUTH: apiMetaData.authenticated,
                AUTH_REDIRECT: apiMetaData.unAuthRedirect,
                ROLES: apiMetaData.roles,
                function: pathRouteMethod,
            });

            // @ts-ignore
            app[apiMetaData.method](
                routes,
                preMiddlewares,
                wrapperMiddleware(
                    instance[pathRouteMethod].bind(instance)
                ),
                postMiddlewares,
            );
        });
        instance.logger = moduleLoggerFactory(moduleMetaData.targetName);
    }
    return ctrls;
}

/**
 * Recursively (taking into account super classes) find names of the methods, that were decorated with given property, in a class.
 * @param clazz - target class
 * @param symbolKey - Symbol('string') which is used to define routes
 * @param foundMethodsNames - array of methods names found (useful when concatenating results of recursive search through superclasses)
 */
// @ts-ignore
function getClassMethodsByDecoratedProperty(clazz, symbolKey: Symbol, foundMethodsNames: string[] = []): string[] {
    const clazzMethods = foundMethodsNames.concat(
        Object.getOwnPropertyNames(clazz.prototype)
            .filter(functionName => functionName !== 'constructor')
            .filter(functionName => Reflect.getOwnMetadata(symbolKey, clazz.prototype[functionName]) !== undefined)
    );

    const parentClazz = Object.getPrototypeOf(clazz);
    if (parentClazz.name !== '') {
        return getClassMethodsByDecoratedProperty(parentClazz, symbolKey, clazzMethods);
    }
    // returns an array of *unique* method names
    return clazzMethods.filter((methodName: string, index: number, array: string[]) => array.indexOf(methodName) === index);
}

/**
 * Send a warning to console and logs if authentication is not enabled
 * @param decorator - the name of the decorator
 * @param controller - controller that contains the function that was decorated
 * @param func - the function name that was decorated by an authentication related decorator
 */
export function logWarningIfNoAuthentication(decorator: string, controller: string, func: string) {
    if (!getConfig().main.authentication.enabled) {
        SystemLogger.warn(`WARNING: Route Insecure. Use of @${decorator} in ${controller?.constructor?.name || 'Unknown'}.${func} while authentication is disabled in notores.json`);
    }
}

/**
 * Send a warning to console and logs if authentication is not enabled
 * @param decorator - the name of the decorator
 * @param controller - controller that contains the function that was decorated
 * @param func - the function name that was decorated by an authentication related decorator
 */
export function logErrorApiMetaDataDoesNotExist(decorator: string, controller: string, func: string) {
    if (!getConfig().main.authentication.enabled) {
        SystemLogger.error(`ERROR: Route does not have an HTTP handle. Use of @${decorator} in ${controller?.constructor?.name || 'Unknown'}.${func}. Try using one of ${Object.keys(HttpMethod).map((method: string) => `@${method}`)}`);
    }
}
