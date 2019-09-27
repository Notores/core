"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { join } = require('path');
const mongoose = require('mongoose');
const { responseHandler } = require("./responseHandler");
const logger = require('../logger')(module);
const registry = [];
/**
 * Middleware for enable deactivating routes
 * @param {string} handle Name of the handle (e.g. notores-login)
 * @return {MiddlewareFunction} Express middleware
 * @example app.get('/login', handleActive('custom-login'), loginMiddleware);
 */
function handleActive(handle) {
    return (req, res, next) => {
        const handleInfo = registry.find(entry => entry.handle === handle);
        if (!handleInfo || handleInfo.active === false)
            next('route');
        else if (handleInfo.active === true)
            next();
        else
            next('route');
    };
}
exports.handleActive = handleActive;
/**
 * Middleware for enabling and disabling handles/routes
 * @param {string} handle Handle name for the handle (e.g. notores-login)
 * @param {boolean} active New active status for given handle
 */
function updateHandleActive(handle, active) {
    const registryObject = registry.find(entry => entry.handle === handle);
    if (registryObject)
        registryObject.active = active;
    else
        logger.warn(`Cannot set handle "${handle}" to active"${active}". Handle not found`);
}
exports.updateHandleActive = updateHandleActive;
/**
 * Adds a route to the handles registry
 * @param {string} handle Name of the handle (e.g. notores-login)
 * @param {string} path The URL for this handle (e.g. /login)
 * @param {string} method The HTTP method for this handle (e.g. post)
 * @example addRouteToRegistry('notores-login', '/login', 'post);
 */
function addRouteToRegistry(handle, path, method) {
    registry.push({ handle, path, method, active: true });
}
exports.addRouteToRegistry = addRouteToRegistry;
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
function routeWithHandle(handle, path, middlewares, { method = 'get', accepts = ['json'], authenticated = false, admin = false, roles = [] } = {}) {
    const server = require('../server');
    if (!Array.isArray(middlewares))
        middlewares = [middlewares];
    addRouteToRegistry(handle, path, method);
    if (accepts) {
        if (!Array.isArray(accepts)) {
            accepts = [accepts];
        }
        middlewares.unshift(exports.checkAcceptsHeaders(accepts));
    }
    if (roles) {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
    }
    const routers = server.getServers();
    const router = admin ? routers.private.router : routers.public.router;
    if (!router) {
        return logger.error(`Server has not been created yet. Cannot add route ${method.toUpperCase()}:${path} with handle ${handle}`);
    }
    router[method](path, handleActive(handle), ...middlewares);
}
exports.routeWithHandle = routeWithHandle;
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
function middlewareForRouter(middlewares, { when = 'pre', accepts = ['json', 'html'], path, level = "public" /* public */ } = {}) {
    const server = require('../server');
    if (!Array.isArray(middlewares))
        middlewares = [middlewares];
    if (accepts) {
        if (!Array.isArray(accepts)) {
            accepts = [accepts];
        }
        middlewares.unshift(exports.checkAcceptsHeaders(accepts));
    }
    if (path)
        middlewares.unshift(exports.checkAcceptsHeaders(accepts, false));
    const routers = server.getServers();
    let app;
    switch (level) {
        case "main" /* main */:
            app = routers.preMiddleware;
            break;
        case "private" /* private */:
            app = when === 'pre' ? routers.private.preMiddleware : routers.private.postMiddleware;
            break;
        default:
            app = when === 'pre' ? routers.public.preMiddleware : routers.public.postMiddleware;
    }
    if (!app) {
        return logger.error(`Server has not been created yet. Cannot add middleware ${path}: ${middlewares[0].toString()}`);
    }
    app.use(...middlewares);
}
exports.middlewareForRouter = middlewareForRouter;
/**
 * Checks if the the
 * @param {string | string[]} headers Accepted Headers. E.g. 'application/json' || ['application/json', 'text/html']
 * @param setResponseType
 * @return {Function}
 */
exports.checkAcceptsHeaders = (headers, setResponseType = true) => {
    return (req, res, next) => {
        const acceptedHeaders = Array.isArray(headers) ? [...headers] : [headers];
        const accepted = req.accepts(acceptedHeaders);
        if (!accepted) {
            return next(new Error(`Not accepted headers: ${acceptedHeaders.join(' ')}`));
        }
        if (setResponseType) {
            // TODO: JSON is default, but should it also have priority?
            if (accepted.indexOf('html') > -1 || accepted.indexOf('text') > -1) {
                res.locals.type = 'html';
            }
            else if (accepted.indexOf('xml') > -1) {
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
function getRegistry() {
    return registry;
}
exports.getRegistry = getRegistry;
/**
 *
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
function checkEmptyParams(req, res, next) {
    const keys = Object.keys(req.params || {});
    if (keys.length === 0) {
        return next('route');
    }
    else {
        return next();
    }
}
exports.checkEmptyParams = checkEmptyParams;
function checkParamIsObjectId(paramName) {
    return (req, res, next) => {
        try {
            mongoose.Types.ObjectId(req.params[paramName]);
            next();
        }
        catch (e) {
            return next('route');
        }
    };
}
exports.checkParamIsObjectId = checkParamIsObjectId;
function checkInput(toCheckArr = [], paramsOrBody = "params" /* params */) {
    return function checkParams(req, res, next) {
        let arr;
        if (!Array.isArray(toCheckArr)) {
            arr = [toCheckArr];
        }
        else {
            arr = toCheckArr;
        }
        for (let i = 0; i < arr.length; i++) {
            const toCheck = arr[i];
            const value = req[paramsOrBody][toCheck.key];
            if (toCheck.type === Number && !validNumber(value)) {
                return next('route');
            }
            else if (toCheck.type === String && !validString(value)) {
                return next('route');
            }
            else if (toCheck.type === Array && !validArray(value)) {
                return next('route');
            }
        }
        next();
    };
}
exports.checkInput = checkInput;
function validNumber(value) {
    return !isNaN(value);
}
function validString(value) {
    return typeof value === 'string';
}
function validArray(value) {
    return Array.isArray(value);
}
//TODO: Create middleware for handling admin routes
