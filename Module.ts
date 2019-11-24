import {AuthenticatedMiddlewareFunction, IRouteRegistryObject, MiddlewareFunction} from "./Types";
import {getServers} from './server';
import {Request, NextFunction, Response, Application, IRouter} from "express";
import log from './logger';
import {addRouteToRegistry, getRegistry} from "./lib/routeUtils";

const logger = log(module);

export interface IRouteWithHandleSettings {
    method?: string;
    accepts?: string[];
    authenticated?: Boolean;
    admin?: Boolean;
    roles?: string[];
}

export default class Module {

    // model: any; //TODO fix this
    // routes: any;
    // service: any;

    constructor(
        public model: any,
        public routes: IRouteRegistryObject[],
        public service: any,
    ) {

    }

    init = () => {

    };

    routeActiveGuard = (handle: string): MiddlewareFunction => (req: Request, res: Response, next: NextFunction) => {
        const registry: IRouteRegistryObject[] = getRegistry();
        const record = registry.find(rec => rec.handle === handle);
        if (record && !record.active) {
            return next('route');
        }
        next();
    };

    roleGuard = (roles: string[]): AuthenticatedMiddlewareFunction => (req: Notores.IAuthenticatedRequest, res: Response, next: NextFunction) => {
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

    unAuthenticatedGuard = (req: Request, res: Response, next: NextFunction) => {
        if (!req.isAuthenticated()) {
            res.locals.error({status: 403, message: 'Not Authenticated'});
            return next('route'); // TODO: Check what we want to do here (API server vs WebsiteServer (Themes)
        }
        next();
    };

    addRouteWithHandle = (
        path: string,
        handle: string,
        middlewares: (MiddlewareFunction | AuthenticatedMiddlewareFunction | Array<MiddlewareFunction | AuthenticatedMiddlewareFunction>),
        {method = 'get', accepts = ['json'], authenticated = false, admin = false, roles = []}: IRouteWithHandleSettings = {}
    ) => {
        if (!Array.isArray(middlewares)) {
            middlewares = [middlewares];
        }

        const routeRegistryObject: IRouteRegistryObject = {path, handle, method, active: true};
        if (!addRouteToRegistry(handle, path, method)) {
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
        const routers = getServers();
        const router = admin ? routers.private.router : routers.public.router;

        // @ts-ignore
        router[method](path, this.routeActiveGuard(handle), ...middlewares);
    }

}