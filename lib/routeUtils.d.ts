import { CheckInputObject, MiddlewareFunction } from "../Types";
import { NextFunction, Request, Response } from "express-serve-static-core";
export declare const enum ParamsOrBodyEnum {
    params = "params",
    body = "body"
}
export declare const enum MiddlewareForRouterLevelEnum {
    public = "public",
    private = "private",
    main = "main"
}
export interface RouteWithHandleSettings {
    method?: string;
    accepts?: string[];
    authenticated?: Boolean;
    admin?: Boolean;
    roles?: string[];
}
export interface MiddlewareForRouterSettings {
    when?: string;
    accepts?: string[];
    path?: string;
    level?: MiddlewareForRouterLevelEnum;
}
export interface RouteRegistryObject {
    handle: string;
    path: string;
    method: string;
    active: Boolean;
}
/**
 * Middleware for enable deactivating routes
 * @param {string} handle Name of the handle (e.g. notores-login)
 * @return {MiddlewareFunction} Express middleware
 * @example app.get('/login', handleActive('custom-login'), loginMiddleware);
 */
export declare function handleActive(handle: string): MiddlewareFunction;
/**
 * Middleware for enabling and disabling handles/routes
 * @param {string} handle Handle name for the handle (e.g. notores-login)
 * @param {boolean} active New active status for given handle
 */
export declare function updateHandleActive(handle: string, active: boolean): void;
/**
 * Adds a route to the handles registry
 * @param {string} handle Name of the handle (e.g. notores-login)
 * @param {string} path The URL for this handle (e.g. /login)
 * @param {string} method The HTTP method for this handle (e.g. post)
 * @example addRouteToRegistry('notores-login', '/login', 'post);
 */
export declare function addRouteToRegistry(handle: string, path: string, method: string): void;
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
 *
 */
export declare function routeWithHandle(handle: string, path: string, middlewares?: MiddlewareFunction[], { method, accepts, authenticated, admin, roles }?: RouteWithHandleSettings): any;
/**
 * Creates middlewares for a router (public vs private). This uses the express' app.use function opposed to the ```routeWithHandle``` which uses ```app[method]```
 * @param {Array<MiddlewareFunction>|MiddlewareFunction} middlewares Middleware functions as accepted by Express. Each middleware function must end by calling ```next```. This enables the notores framework to handle the function graciously
 * @param {MiddlewareForRouterSettings} options Middleware options
 * @param {String} options.when Before or after the main routers. Optional values are ```pre``` and ```post```
 * @param {Array<String>} options.accepts Checks the ```Accept:``` header
 * @param {String} options.path The URL for this handle (e.g. /login)
 * @param {String} options.level Public or Private. Optional values are ```public``` and ```private```
 * @example middlewareForRouter([PaymentRouter.postPaymentSendMail,], {when: 'post', path: '/payment'});
 */
export declare function middlewareForRouter(middlewares?: MiddlewareFunction | MiddlewareFunction[], { when, accepts, path, level }?: MiddlewareForRouterSettings): any;
/**
 * Checks if the the
 * @param headers
 * @param setResponseType
 * @return {Function}
 */
export declare const checkAcceptsHeaders: (headers: string | string[], setResponseType?: Boolean) => MiddlewareFunction;
/**
 * Returns the handle registry
 * @return {Array<Object>}
 */
export declare function getRegistry(): RouteRegistryObject[];
/**
 *
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
export declare function checkEmptyParams(req: Request, res: Response, next: NextFunction): void;
export declare function checkParamIsObjectId(paramName: string): MiddlewareFunction;
export declare function checkInput(toCheckArr?: CheckInputObject | CheckInputObject[], paramsOrBody?: ParamsOrBodyEnum): MiddlewareFunction;
//# sourceMappingURL=routeUtils.d.ts.map