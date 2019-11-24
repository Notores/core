import {IsAuthenticatedFunction, ISessionObject} from "../../Types";

declare module 'express' {
    interface Request {
        user: Notores.IAuthenticatedUser;
        isAuthenticated: IsAuthenticatedFunction;
        notores: Notores.INotoresConfig;
        session: ISessionObject;
        login: Function;
        logout: Function;
    }
}

