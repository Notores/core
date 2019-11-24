import { AuthenticatedMiddlewareFunction, IRouteRegistryObject, MiddlewareFunction } from "./Types";
import { Request, NextFunction, Response } from "express";
export interface IRouteWithHandleSettings {
    method?: string;
    accepts?: string[];
    authenticated?: Boolean;
    admin?: Boolean;
    roles?: string[];
}
export default class Module {
    model: any;
    routes: IRouteRegistryObject[];
    service: any;
    constructor(model: any, routes: IRouteRegistryObject[], service: any);
    init: () => void;
    routeActiveGuard: (handle: string) => MiddlewareFunction;
    roleGuard: (roles: string[]) => AuthenticatedMiddlewareFunction;
    unAuthenticatedGuard: (req: Request, res: Response, next: NextFunction) => void;
    addRouteWithHandle: (path: string, handle: string, middlewares: MiddlewareFunction | AuthenticatedMiddlewareFunction | (MiddlewareFunction | AuthenticatedMiddlewareFunction)[], { method, accepts, authenticated, admin, roles }?: IRouteWithHandleSettings) => void;
}
//# sourceMappingURL=Module.d.ts.map