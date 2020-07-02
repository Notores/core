import 'reflect-metadata';
import {DATA_KEY, HTTP_METHOD, MIDDLEWARE, MODULE_PATH, ROOT_ROUTE} from "../constants";
import {Request} from "express";
import {Response} from "express";
import {NextFunction} from "express";
import {IServer} from "../interfaces/IServer";
import {join} from "path";
import {apiParameterMetadataKey} from "../symbols";
import {ParamTypes} from "./Api";
import {loggerFactory} from "../lib/logger";
import {getConfig} from "../lib/config";
const logger = loggerFactory(module);

export const paths: { [key: string]: any } = [];

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
        // @ts-ignore
        const rootRoute: string = Clazz[ROOT_ROUTE];

        // @ts-ignore
        const dataKey: string = Clazz[DATA_KEY];
        // @ts-ignore
        const modulePath: string = Clazz[MODULE_PATH];

        if (!rootRoute || !rootRoute.startsWith('/')) {
            // TODO test it
            throw new Error('Class-level \'@Root\' decorator must be used with single string argument starting with forward slash (eg. \'/\' or \'/myRoot\')!');
        }

        // @Use // DO THIS
        const middlewareDeclarationMethods = getClassMethodsByDecoratedProperty(Clazz, MIDDLEWARE);
        middlewareDeclarationMethods.forEach(middlewareDeclarationMethod => {
            const {PATH_ROUTE, HTTP_METHOD, IS_PRE_MIDDLEWARE, IS_POST_MIDDLEWARE, PRIVATE, AUTH, ROLES} = instance[middlewareDeclarationMethod];

            const wrapperMiddleware = (routingFunction: any) => {
                return async (req: Request, res: Response, next: NextFunction) => {
                    if(useAuthentication && AUTH && !req.user) {
                        return next();
                    }

                    const result = await routingFunction(req, res, next);

                    if (result) {
                        let body;

                        if (typeof result === 'object') {
                            body = result;
                        } else {
                            body = {[dataKey]: result};
                        }

                        res.locals.setBody(body);
                    }
                    next();
                }
            };

            const app = server[PRIVATE ? 'private' : 'public'];

            const mids = [];
            const midsObj = {
                method: 'use',
                ROUTE: PATH_ROUTE,
                PATH: '',
                WHERE: IS_PRE_MIDDLEWARE ? 'PRE ROUTES' : 'POST ROUTES',
                PRIVATE,
                AUTH,
                ROLES,
                function: middlewareDeclarationMethod,
            }

            if (midsObj.ROUTE && midsObj.ROUTE.toLowerCase() !== 'all') {
                mids.push(midsObj.ROUTE)
            } else {
                midsObj.ROUTE = 'ALL';
            }

            mids.push(
                wrapperMiddleware(
                    instance[middlewareDeclarationMethod].bind(instance)
                )
            );

            paths.push(midsObj);

            if (IS_PRE_MIDDLEWARE) {
                app.preMiddleware.use(mids)
            } else {
                app.postMiddleware.use(mids);
            }
        });

        // @Path
        const pathRouteMethods = getClassMethodsByDecoratedProperty(Clazz, HTTP_METHOD);
        pathRouteMethods.forEach(pathRouteMethod => {
            const {PATH_ROUTE, HTTP_METHOD, PRE_MIDDLEWARE, POST_MIDDLEWARE, PRIVATE, AUTH, AUTH_REDIRECT, ROLES, PAGE_GEN} = instance[pathRouteMethod];

            const wrapperMiddleware = (routingFunction: any) => {
                return async (req: Request, res: Response, next: NextFunction) => {
                    const params = [];
                    let existingApiDecorators = Reflect.getOwnMetadata(apiParameterMetadataKey, instance[pathRouteMethod]) ?? [];
                    existingApiDecorators.forEach((d: {type: string, index: number, data?: any}) => {
                        let obj;
                        switch(d.type) {
                            case 'request':
                                obj = req;
                                break;
                            case 'response':
                                obj = res;
                                break;
                            case 'next':
                                obj = next;
                                break;
                            case 'config':
                                obj = req.notores;
                                break;
                            case 'body':
                                obj = req.body;
                                break;
                            case 'user':
                                if(AUTH) {
                                    logger.error(`Warning: Using @user where a route doesn't have the Authenticated decorator! ${Clazz}:${pathRouteMethod}`);
                                }
                                obj = req.user;
                                break;
                            case 'query':
                                obj = req.query;
                                break;
                            case 'params':
                                obj = req.params;
                                break;
                            case 'param':
                                let val: any = req.params[d.data!.key]
                                if(d.data!.type) {
                                    switch(d.data!.type) {
                                        case ParamTypes.int:
                                        case ParamTypes.integer:
                                            val = parseInt(val);
                                            break;
                                        case ParamTypes.float:
                                            val = parseFloat(val);
                                            break;
                                        case ParamTypes.bool:
                                        case ParamTypes.boolean:
                                            val = !!val;
                                            break;
                                    }
                                }

                                obj = val;
                        }
                        params[d.index] = obj;
                    });

                    params.push(req);
                    params.push(res);
                    params.push(next);

                    const result = await routingFunction(...params);
                    let body;

                    if (req.method === 'GET' && res.headersSent) {
                        return;
                    }

                    if (typeof result === 'object' && !Array.isArray(result) && result.hasOwnProperty(dataKey)) {
                        body = result;
                    } else if (result instanceof Error) {
                        body = {error: result.message};
                    } else {
                        body = {[dataKey]: result};
                    }
                    res.locals.setBody(body);
                    next();
                }
            };

            // const {PATH_ROUTE, HTTP_METHOD, PRE_MIDDLEWARE, POST_MIDDLEWARE, PRIVATE, AUTH, AUTH_REDIRECT, ROLES, PAGE_GEN} = instance[pathRouteMethod];
            const app = server[PRIVATE ? 'private' : 'public'].router;


            const preMiddlewares: Function[] = [];
            const postMiddlewares: Function[] = [];

            if (useAuthentication && AUTH) {
                preMiddlewares.push(
                    (req: Request, res: Response, next: NextFunction) => {
                        if (!req.isAuthenticated()) {
                            res.locals.error = {status: 403, message: 'Not Authenticated'};

                            if (AUTH_REDIRECT) {
                                res.status(res.locals.error.status);
                                if (res.locals.type === 'html') {
                                    res.redirect('/login');
                                } else {
                                    res.json(res.locals.error);
                                }
                            }

                            return next('route');
                        }

                        if (Array.isArray(ROLES) && ROLES.length > 0) {
                            if (req.user!.roles!.length === 0) {
                                return next('route');
                            }
                            for (let i = 0; i < ROLES.length; i++) {
                                const role = ROLES[i];
                                for (let i = 0; i < req!.user!.roles!.length; i++) {
                                    const r = req.user!.roles[i];
                                    const userRole = typeof r === 'string' ? r : r.role;
                                    if (userRole[i].toLowerCase() === role.toLowerCase()) {
                                        return next();
                                    }
                                }
                            }
                        } else {
                            return next();
                        }
                    }
                )
            }

            if (PAGE_GEN) {
                postMiddlewares.push(
                    (req: Request, res: Response, next: NextFunction) => {
                        res.locals.addPageLocations([
                            join(modulePath, 'pages')
                        ]);
                        res.locals.addPages(
                            PAGE_GEN
                        );
                        return next();
                    }
                );
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

            addMiddleware(PRE_MIDDLEWARE, preMiddlewares);
            addMiddleware(POST_MIDDLEWARE, postMiddlewares);

            const route = rootRoute === '/' ? PATH_ROUTE : rootRoute + PATH_ROUTE;

            paths.push({
                method: HTTP_METHOD,
                ROUTE: route,
                PATH: PATH_ROUTE,
                PRE_MIDLE: preMiddlewares.length,
                POST_MIDDLE: postMiddlewares.length,
                PAGE: PAGE_GEN,
                PRIVATE,
                AUTH,
                AUTH_REDIRECT,
                ROLES,
                function: pathRouteMethod,
            });

            // @ts-ignore
            app[HTTP_METHOD](
                route,
                preMiddlewares,
                wrapperMiddleware(
                    instance[pathRouteMethod].bind(instance)
                ),
                postMiddlewares,
            );
        });

        // app.use(rootRoute, router);
    }
    return ctrls;
}

/**
 * Recursively (taking into account super classes) find names of the methods, that were decorated with given property, in a class.
 * @param clazz - target class
 * @param decoratedPropertyName - name of the property known to be added by decorator, eg. 'ROOT_ROUTE'
 * @param foundMethodsNames - array of methods names found (useful when concatenating results of recursive search through superclasses)
 */
// @ts-ignore
function getClassMethodsByDecoratedProperty(clazz, decoratedPropertyName: string, foundMethodsNames: string[] = []): string[] {
    const clazzMethods = foundMethodsNames.concat(
        Object.getOwnPropertyNames(clazz.prototype)
            .filter(functionName => functionName !== 'constructor')
            .filter(functionName => clazz.prototype[functionName][decoratedPropertyName] !== undefined)
    );

    const parentClazz = Object.getPrototypeOf(clazz);
    if (parentClazz.name !== '') {
        return getClassMethodsByDecoratedProperty(parentClazz, decoratedPropertyName, clazzMethods);
    }
    // returns an array of *unique* method names
    return clazzMethods.filter((methodName, index, array) => array.indexOf(methodName) === index);
}

/**
 * Send a warning to console and logs if authentication is not enabled
 * @param decorator - the name of the decorator
 * @param controller - controller that contains the function that was decorated
 * @param func - the function name that was decorated by an authentication related decorator
 */
export function logWarningIfNoAuthentication(decorator: string, controller: string, func: string) {
    if(!getConfig().main.authentication.enabled) {
        logger.warn(`WARNING: Route Insecure. Use of @${decorator} in ${controller?.constructor?.name || 'Unknown'}.${func} while authentication is disabled in notores.json`);
    }
}
