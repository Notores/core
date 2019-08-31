import {Request, Response, NextFunction, Application} from 'express';
import {IRouter} from "express-serve-static-core";

declare global {
    namespace Notores {
        interface INotoresConfig {}
        interface ISessionObject {}
        interface IAuthenticatedUser {}
    }
}

export interface IErrorObject {
    error: string,
}

export interface IDefaultConfigObject {
    key: string,
    value: object
}

export interface IServer {
    main: Application,
    preMiddleware: Application,
    public: {
        main: Application,
        preMiddleware: Application,
        router: IRouter,

        postMiddleware: Application,
    },
    private: {
        main: Application,
        preMiddleware: Application,
        router: IRouter,
        postMiddleware: Application,
    },
}

export interface ICheckInputObject {
    key: string,
    type: Object,
}

export interface INotoresConfig {
    error: string,
    main: {
        authentication: {
            usernameField: string,
            saltRounds: number
        },
        jwt: {
            secretOrKey: string,
            issuer: string,
            audience: string
        }
    }
}

declare global {
    namespace Express {
        export interface Request {
            user?: IAuthenticatedUser,
            isAuthenticated: IsAuthenticatedFunction,
            notores: INotoresConfig,
            session: ISessionObject,
            login: Function,
        }
    }
}

export interface ISessionObject {
    id: string,
}

export interface IAuthenticatedUser {
    roles: string[],
}

export const enum ParamsOrBodyEnum {
    params = 'params',
    body = 'body',
}

export const enum MiddlewareForRouterLevelEnum {
    public = 'public',
    private = 'private',
    main = 'main',
}

export interface IRouteWithHandleSettings {
    method?: string,
    accepts?: string[],
    authenticated?: Boolean,
    admin?: Boolean,
    roles?: string[],
}

export interface IMiddlewareForRouterSettings {
    when?: string,
    accepts?: string[],
    path?: string,
    level?: MiddlewareForRouterLevelEnum,
}

export interface IRouteRegistryObject {
    handle: string,
    path: string,
    method: string,
    active: Boolean,
}

export type IsAuthenticatedFunction = () => Boolean;

export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => Promise<any> | void;