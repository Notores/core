import {Request, Response, NextFunction} from 'express';
import {ISessionObject} from "..";

declare global {
    namespace Notores {
        interface user {
            roles: string[] | {role: string}[];

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

    }
    namespace Express {

        interface User extends Notores.user {

        }

        interface Request {
            notores: Notores.IConfig;
            session: ISessionObject;
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

export declare type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => Promise<any> | void;

