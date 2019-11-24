"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const logger_1 = __importDefault(require("./logger"));
const routeUtils_1 = require("./lib/routeUtils");
const logger = logger_1.default(module);
class Module {
    // model: any; //TODO fix this
    // routes: any;
    // service: any;
    constructor(model, routes, service) {
        this.model = model;
        this.routes = routes;
        this.service = service;
        this.init = () => {
        };
        this.routeActiveGuard = (handle) => (req, res, next) => {
            const registry = routeUtils_1.getRegistry();
            const record = registry.find(rec => rec.handle === handle);
            if (record && !record.active) {
                return next('route');
            }
            next();
        };
        this.roleGuard = (roles) => (req, res, next) => {
            if (req.user.roles.length === 0) {
                return next('route');
            }
            for (let i = 0; i < roles.length; i++) {
                const role = roles[i];
                for (let i = 0; i < req.user.roles.length; i++) {
                    if (req.user.roles[i].toLowerCase() === role.toLowerCase()) {
                        return next();
                    }
                }
            }
            next('route');
        };
        this.unAuthenticatedGuard = (req, res, next) => {
            if (!req.isAuthenticated()) {
                res.locals.error({ status: 403, message: 'Not Authenticated' });
                return next('route'); // TODO: Check what we want to do here (API server vs WebsiteServer (Themes)
            }
            next();
        };
        this.addRouteWithHandle = (path, handle, middlewares, { method = 'get', accepts = ['json'], authenticated = false, admin = false, roles = [] } = {}) => {
            if (!Array.isArray(middlewares)) {
                middlewares = [middlewares];
            }
            const routeRegistryObject = { path, handle, method, active: true };
            if (!routeUtils_1.addRouteToRegistry(handle, path, method)) {
                // @ts-ignore
                logger.error(`ERROR: ${method}:${path} with handle ${handle} has not been added`);
                return;
            }
            this.routes.push(routeRegistryObject);
            if (authenticated) {
                middlewares.unshift(this.unAuthenticatedGuard);
                if (roles && !Array.isArray(roles)) {
                    roles = [roles];
                }
                middlewares.unshift(this.roleGuard(roles));
            }
            const routers = server_1.getServers();
            const router = admin ? routers.private.router : routers.public.router;
            // @ts-ignore
            router[method](path, this.routeActiveGuard(handle), ...middlewares);
        };
    }
}
exports.default = Module;
