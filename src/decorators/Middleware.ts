import {
    ModuleMiddlewareDecoratorOptionsPost,
    ModuleMiddlewareDecoratorOptionsPre
} from "../interfaces/ModuleMethodDecoratorOptions";
import {
    AUTH,
    PATH_ROUTE,
    ROLES,
    PRIVATE,
    IS_PRE_MIDDLEWARE, IS_POST_MIDDLEWARE, MIDDLEWARE
} from "../constants";

interface IMiddlewareDecoratorOptions {
    PATH_ROUTE?: string;
    IS_PRE_MIDDLEWARE?: boolean;
    IS_POST_MIDDLEWARE?: boolean;
    PRIVATE?: boolean;
    AUTH?: boolean;
    ROLES?: string[];
}

interface IMiddlewareOptions {
    path: string;
    pre: boolean;
    post: boolean;
    roles: string[];
    authenticated: boolean;
    private: boolean;
}

type IMiddlewareDecoratorOptionsAndFunction = IMiddlewareDecoratorOptions & Function

function defaultMiddlewareSettings(obj?: Partial<IMiddlewareDecoratorOptionsAndFunction> | string): IMiddlewareOptions {
    return {
        path: typeof obj === 'string' ? obj : obj?.PATH_ROUTE || '',
        pre: true,
        post: false,
        roles: [],
        authenticated: false,
        private: false,
    }
}


export function Use(middlewares?: ModuleMiddlewareDecoratorOptionsPre | ModuleMiddlewareDecoratorOptionsPost) {
    return (target: any, propertyKey: string) => {
        const targetFunc = target[propertyKey];
        const set: IMiddlewareOptions = defaultMiddlewareSettings();

        targetFunc[PATH_ROUTE] = set.path;
        targetFunc[ROLES] = set.roles;
        targetFunc[AUTH] = set.authenticated;
        targetFunc[PRIVATE] = set.private;
        targetFunc[PATH_ROUTE] = '';
        targetFunc[MIDDLEWARE] = true;

        if (middlewares) {
            if (middlewares.path) {
                targetFunc[PATH_ROUTE] = middlewares.path;
            }
            if (middlewares.authenticated) {
                targetFunc[AUTH] = true;
            }

            if (middlewares.hasOwnProperty('pre')) {
                targetFunc[IS_PRE_MIDDLEWARE] = true;
                targetFunc[IS_POST_MIDDLEWARE] = false;
            } else if (middlewares.hasOwnProperty('post')) {
                targetFunc[IS_PRE_MIDDLEWARE] = false;
                targetFunc[IS_POST_MIDDLEWARE] = true;
            }
        } else {
            targetFunc[IS_PRE_MIDDLEWARE] = true;
        }
    }
}
