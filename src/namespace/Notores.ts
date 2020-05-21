import {Request, Response, NextFunction} from 'express';
import {MiddlewareForRouterLevelEnum} from "../enums/MiddlewareForRouterLevelEnum";
// import {User as NUser} from "../modules/user/User";

declare global {
    namespace Notores {
        interface user {
            email: string;

            password: string;

            firstname: string;

            middlename?: string;

            lastname: string;

            roles: string[];

            readonly name: string;

            verifyPassword(input: string): Promise<{ message: string } | Error>;

            updatePassword(oldPass: string, newPass: string): Promise<{ message: string } | Error>;
        }

        interface IConfigObject extends Object {
            [key: string]: string | object | object[]
        }

        interface IConfig extends Notores.IConfigObject {
            main: {
                useCookie: boolean; // default: true
                cookieSecret?: string;
                authentication: {
                    usernameField: string; // default: email
                    saltRounds: number; // default: 15
                };
                jwt: {
                    secretOrKey: string;
                    issuer: string;
                    audience: string;
                };
                [key: string]: any;

            };
            theme: IThemeConfig | boolean;

            [key: string]: any;
        }

        interface ISessionObject {
            id: string | number;
            jwt: string;
        }
    }
    namespace Express {

        // interface User extends Notores.User {
        //
        // }

        interface Request {
            // @ts-ignore
            user?: Notores.user | Express.User | undefined;
            notores: Notores.IConfig;
            session: Notores.ISessionObject;
            db?: null | {
                connection: any;
                type: string;
                error?: Error | null
            };
        }
    }
}

export interface IThemeConfig {
    public: {
        name: string,
        isApp: boolean;
    };
    admin: {
        name: string,
        isApp: boolean;
    };
}

export interface ICheckInputObject {
    key: string;
    type: Object;
}

export interface ISessionObject {
    id: string | number;
    jwt: string;
}

export declare const enum ParamsOrBodyEnum {
    params = "params",
    body = "body"
}

export interface IRouteWithHandleSettings {
    method?: string;
    accepts?: string[];
    authenticated?: Boolean;
    admin?: Boolean;
    roles?: string[];
}

export interface IMiddlewareForRouterSettings {
    when?: string;
    accepts?: string[];
    path?: string;
    level?: MiddlewareForRouterLevelEnum;
}

export interface IRouteRegistryObject {
    handle: string;
    path: string;
    method: string;
    active: Boolean;
}

export interface StringKeyObject {
    [key: string]: any
}


export declare type IsAuthenticatedFunction = () => Boolean;
export declare type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => Promise<any> | void;

