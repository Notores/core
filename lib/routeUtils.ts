import {NextFunction, Request, Response} from "express-serve-static-core";
import {
    MiddlewareFunction,
    AuthenticatedMiddlewareFunction,
    IRouteRegistryObject, IRouteWithHandleSettings, MiddlewareForRouterLevelEnum,
    IMiddlewareForRouterSettings,
    ParamsOrBodyEnum,
    ICheckInputObject,
} from "../Types";

const {join} = require('path');
const mongoose = require('mongoose');
const {responseHandler} = require("./responseHandler");
const logger = require('../logger')(module);
const registry: IRouteRegistryObject[] = [];

/**
 * Middleware for enable deactivating routes
 * @param {string} handle Name of the handle (e.g. notores-login)
 * @return {MiddlewareFunction} Express middleware
 * @example app.get('/login', handleActive('custom-login'), loginMiddleware);
 */
export function handleActive(handle: string): MiddlewareFunction {
    return function handleActive(req, res, next) {
        const handleInfo = registry.find(entry => entry.handle === handle);

        if (!handleInfo || handleInfo.active === false)
            next('route');
        else if (handleInfo.active === true)
            next();
        else
            next('route');
    }
}

/**
 * Middleware for enabling and disabling handles/routes
 * @param {string} handle Handle name for the handle (e.g. notores-login)
 * @param {boolean} active New active status for given handle
 */
export function updateHandleActive(handle: string, active: boolean): void {
    const registryObject: IRouteRegistryObject | undefined = registry.find(entry => entry.handle === handle);
    if (registryObject)
        registryObject.active = active;
    else
        logger.warn(`Cannot set handle "${handle}" to active"${active}". Handle not found`);
}

/**
 * Adds a route to the handles registry
 * @param {string} handle Name of the handle (e.g. notores-login)
 * @param {string} path The URL for this handle (e.g. /login)
 * @param {string} method The HTTP method for this handle (e.g. post)
 * @example addRouteToRegistry('notores-login', '/login', 'post);
 */
export function addRouteToRegistry(handle: string, path: string, method: string) {
    const exists = registry.find(reg => reg.handle === handle);
    if (exists) {
        logger.error(`Handle ${handle} is already in use by route ${exists.method}:${exists.path}`);
        return false;
    }
    registry.push({handle, path, method, active: true});
    return true;
}


const routeActiveGuard = (handle: string): MiddlewareFunction => function routeActiveGuard(req: Request, res: Response, next: NextFunction) {
    const registry: IRouteRegistryObject[] = getRegistry();
    const record = registry.find(rec => rec.handle === handle);
    if (record && !record.active) {
        return next('route');
    }
    next();
};

const roleGuard = (roles: string[]): AuthenticatedMiddlewareFunction => function roleGuard(req: Notores.IAuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.user!.roles.length === 0) {
        return next('route');
    }

    for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        for (let i = 0; i < req!.user!.roles.length; i++) {
            if (req.user.roles[i].toLowerCase() === role.toLowerCase()) {
                return next();
            }
        }
    }

    next('route');
};

function unAuthenticatedGuard(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
        res.locals.error({status: 403, message: 'Not Authenticated'});
        return next('route'); // TODO: Check what we want to do here (API server vs WebsiteServer (Themes)
    }
    next();
};

/**
 * Create routes for your app with a handle
 * @param {String} handle Name of the handle (e.g. notores-login)
 * @param {String} path The URL for this handle (e.g. /login)
 * @param {Array<Function>} middlewares Middleware functions as accepted by Express. Each middleware function must end by calling ```next```. This enables the notores framework to handle the function graciously
 * @param {Object} options Router options
 * @param {String} options.method The HTTP method for this handle (e.g. post)
 * @param {Array<String>} options.accepts Accepted Content-Type
 * @param {Boolean} options.authenticated Should the user be authenticated
 * @param {Boolean} options.admin Should the user have the admin role
 * @param {Array<String>} options.roles Any roles the user should have
 */
export function routeWithHandle(handle: string, path: string, middlewares: Array<MiddlewareFunction | AuthenticatedMiddlewareFunction>, {method = 'get', accepts = ['json'], authenticated = false, admin = false, roles = []}: IRouteWithHandleSettings = {}) {
    const server = require('../server');

    if (!Array.isArray(middlewares))
        middlewares = [middlewares];

    addRouteToRegistry(handle, path, method);

    if (accepts) {
        if (!Array.isArray(accepts)) {
            accepts = [accepts];
        }
        middlewares.unshift(checkAcceptsHeaders(accepts));
    }

    if (authenticated) {
        middlewares.unshift(unAuthenticatedGuard);
        if (roles) {
            if (!Array.isArray(roles)) {
                roles = [roles];
            }
            if (roles.length > 0) {
                middlewares.unshift(roleGuard(roles));
            }
        }
    }

    const routers = server.getServers();
    const router = admin ? routers.private.router : routers.public.router;

    if (!router) {
        return logger.error(`Server has not been created yet. Cannot add route ${method.toUpperCase()}:${path} with handle ${handle}`);
    }

    router[method](path, handleActive(handle), ...middlewares);
}

/**
 * Creates middlewares for a router (public vs private). This uses the express' app.use function opposed to the ```routeWithHandle``` which uses ```app[method]```
 * @param {Array<MiddlewareFunction>|MiddlewareFunction} middlewares Middleware functions as accepted by Express. Each middleware function must end by calling ```next```. This enables the notores framework to handle the function graciously
 * @param {IMiddlewareForRouterSettings} options Middleware options
 * @param {String} options.when Before or after the main routers. Optional values are ```pre``` and ```post```
 * @param {Array<String>} options.accepts Checks the ```Accept:``` header
 * @param {String} options.path The URL for this handle (e.g. /login)
 * @param {String} options.level Public or Private. Optional values are ```public``` and ```private```
 * @example middlewareForRouter([PaymentRouter.postPaymentSendMail,], {when: 'post', path: '/payment'});
 */
export function middlewareForRouter(middlewares: Array<MiddlewareFunction | AuthenticatedMiddlewareFunction>, {when = 'pre', accepts = ['json', 'html'], path, level = MiddlewareForRouterLevelEnum.public}: IMiddlewareForRouterSettings = {}) {
    const server = require('../server');

    if (!Array.isArray(middlewares))
        middlewares = [middlewares];

    if (accepts) {
        if (!Array.isArray(accepts)) {
            accepts = [accepts];
        }
        middlewares.unshift(checkAcceptsHeaders(accepts));
    }

    if (path)
        middlewares.unshift(checkAcceptsHeaders(accepts, false));

    const routers = server.getServers();
    let app;
    switch (level) {
        case MiddlewareForRouterLevelEnum.main:
            app = routers.preMiddleware;
            break;
        case MiddlewareForRouterLevelEnum.private:
            app = when === 'pre' ? routers.private.preMiddleware : routers.private.postMiddleware;
            break;
        default:
            app = when === 'pre' ? routers.public.preMiddleware : routers.public.postMiddleware;
    }

    if (!app) {
        return logger.error(`Server has not been created yet. Cannot add middleware ${path}: ${middlewares[0].toString()}`);
    }

    app.use(...middlewares)
}

/**
 * Checks if the the
 * @param {string | string[]} headers Accepted Headers. E.g. 'application/json' || ['application/json', 'text/html']
 * @param setResponseType
 * @return {Function}
 */
export const checkAcceptsHeaders = (headers: string | string[], setResponseType: Boolean = true): MiddlewareFunction => {
    return function checkAcceptsHeader(req, res, next) {
        const acceptedHeaders: string[] = Array.isArray(headers) ? [...headers] : [headers];

        const accepted = req.accepts(acceptedHeaders);

        if (!accepted) {
            return next(new Error(`Not accepted headers: ${acceptedHeaders.join(' ')}`));
        }

        if (setResponseType) {
            // TODO: JSON is default, but should it also have priority?
            if (accepted.indexOf('html') > -1 || accepted.indexOf('text') > -1) {
                res.locals.type = 'html';
            } else if (accepted.indexOf('xml') > -1) {
                res.locals.type = 'xml';
            }
        }

        // default is json
        return next();
    };
};

/**
 * Returns the handle registry
 * @return {Array<Object>}
 */
export function getRegistry(): IRouteRegistryObject[] {
    return registry;
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
export function checkEmptyParams(req: Request, res: Response, next: NextFunction): void {
    const keys = Object.keys(req.params || {});

    if (keys.length === 0) {
        return next('route');
    } else {
        return next();
    }
}

export function checkParamIsObjectId(paramName: string): MiddlewareFunction {
    return function checkParamIsObjectId(req, res, next) {
        try {
            mongoose.Types.ObjectId(req.params[paramName]);
            next();
        } catch (e) {
            return next('route');
        }
    }
}

export function checkInput(toCheckArr: ICheckInputObject | ICheckInputObject[] = [], paramsOrBody: ParamsOrBodyEnum = ParamsOrBodyEnum.params): MiddlewareFunction {
    return function checkParams(req, res, next) {
        let arr: ICheckInputObject[];
        if (!Array.isArray(toCheckArr)) {
            arr = [toCheckArr];
        } else {
            arr = toCheckArr;
        }

        for (let i = 0; i < arr.length; i++) {
            const toCheck = arr[i];
            const value = req[paramsOrBody][toCheck.key];

            if (toCheck.type === Number && !validNumber(value)) {
                return next('route');
            } else if (toCheck.type === String && !validString(value)) {
                return next('route');
            } else if (toCheck.type === Array && !validArray(value)) {
                return next('route');
            }
        }
        next();
    }
}

function validNumber(value: any): Boolean {
    return !isNaN(value);
}

function validString(value: any): Boolean {
    return typeof value === 'string';
}

function validArray(value: any): Boolean {
    return Array.isArray(value);
}


//TODO: Create middleware for handling admin routes
