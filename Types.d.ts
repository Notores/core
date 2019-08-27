import {Request, Response, NextFunction, Application} from 'express';
import {IRouter} from "express-serve-static-core";

interface IServer {
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

interface CheckInputObject {
    key: string,
    type: Object,
}

declare global {
    namespace Express {
        export interface Request {
            user?: AuthenticatedUser,
            isAuthenticated: IsAuthenticatedFunction,
            notores: Object,
            session: SessionObject,
            login: Function,
        }
    }
}

interface SessionObject {
    id: string,
}

interface AuthenticatedUser {
    roles: string[],
}

type IsAuthenticatedFunction = () => Boolean;

type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => Promise<any> | void;