import {
    AUTH,
    HTTP_METHOD,
    PATH_ROUTE,
    POST_MIDDLEWARE,
    PRE_MIDDLEWARE,
    ROLES,
    PRIVATE,
    PAGE_GEN, AUTH_REDIRECT
} from "../constants";
import { loggerFactory } from "../lib/logger";
import { ModuleMethodDecoratorOptions } from "../interfaces/ModuleMethodDecoratorOptions";
import {logWarningIfNoAuthentication} from "./helpers";

const logger = loggerFactory(module);

interface IMethodDecoratorOptions {
    PATH_ROUTE?: string | RegExp;
    PRE_MIDDLEWARE?: Array<Function>;
    POST_MIDDLEWARE?: Array<Function>;
    PRIVATE?: boolean;
    AUTH?: boolean;
    ROLES?: string[];
    PAGE_GEN?: string[];
    AUTH_REDIRECT?: boolean;
}

interface IMethodOptions {
    path: string | RegExp;
    pre: Array<Function | string>;
    post: Array<Function | string>;
    roles: string[];
    authenticated: boolean;
    private: boolean;
    pages: string[];
    redirect: boolean;
}

type IMethodDecoratorOptionsAndFunction = IMethodDecoratorOptions & Function

function defaultMethodSettings(obj?: Partial<IMethodDecoratorOptionsAndFunction> | string): IMethodOptions {
    return {
        path: typeof obj === 'string' ? obj : obj?.PATH_ROUTE || '',
        pre: [],
        post: [],
        roles: [],
        authenticated: false,
        private: false,
        pages: [],
        redirect: false,
    }
}

function getSettings(set: Partial<IMethodDecoratorOptionsAndFunction>) {
    const base = {
        ...defaultMethodSettings(set),
    };
    const {PATH_ROUTE, PRE_MIDDLEWARE, POST_MIDDLEWARE, PRIVATE, AUTH, ROLES, AUTH_REDIRECT}: IMethodDecoratorOptions = set;
    if (PATH_ROUTE) {
        base.path = PATH_ROUTE;
    }
    if (PRE_MIDDLEWARE) {
        base.pre = PRE_MIDDLEWARE;
    }
    if (POST_MIDDLEWARE) {
        base.post = POST_MIDDLEWARE;
    }
    if (PRIVATE) {
        base.private = PRIVATE;
    }
    if (AUTH) {
        base.authenticated = AUTH;
    }
    if (ROLES) {
        base.roles = ROLES;
    }
    base.pages = [];
    return base;
}

function normalizeSettingsInput(input: IMethodOptions): IMethodOptions {
    return {
        authenticated: input.authenticated,
        path: input.path,
        post: Array.isArray(input.post) ? input.post : [input.post],
        pre: Array.isArray(input.pre) ? input.pre : [input.pre],
        private: input.private,
        roles: Array.isArray(input.roles) ? input.roles : [input.roles],
        pages: Array.isArray(input.pages) ? input.pages : [input.pages],
        redirect: input.redirect,
    };
}

function combineSettings(targetFunction: Function, input: ModuleMethodDecoratorOptions): IMethodOptions {
    const settings: IMethodOptions = {
        ...defaultMethodSettings(targetFunction),
        ...getSettings(targetFunction),
    };
    const newSettings: IMethodOptions = normalizeSettingsInput(settings);

    if (input.path) {
        if (newSettings.path === '') {
            newSettings.path = input.path;
        } else {
            logger.warn(`Path is already set, skipping settings path. Old: ${newSettings.path}. New: ${settings.path}`)
        }
    }
    if (input.pre) {
        const mids: Array<Function | string> = Array.isArray(input.pre) ? input.pre : [input.pre];
        newSettings.pre.push(...mids);
    }
    if (input.post) {
        const mids: Array<Function | string> = Array.isArray(input.post) ? input.post : [input.post];
        newSettings.post.push(...mids);
    }
    if (input.authenticated) {
        newSettings.authenticated = input.authenticated;
    }
    if(input.pages ) {
        newSettings.pages.push(...input.pages);
    }
    return newSettings;
}

function applySettings(target: any, settings: IMethodOptions) {
    target[PATH_ROUTE] = settings.path || '/';
    target[PRE_MIDDLEWARE] = settings.pre;
    target[POST_MIDDLEWARE] = settings.post;
    target[ROLES] = settings.roles;
    target[AUTH] = settings.authenticated;
    target[PRIVATE] = settings.private;
    target[AUTH_REDIRECT] = settings.redirect;
}

function generateHttpMethodDecorator(method: string, addId = false) {
    return function Path(settings?: ModuleMethodDecoratorOptions | string) {
        return function (target: any, propertyKey: string) {
            const targetFunc = target[propertyKey];
            let set: IMethodOptions;
            if (!settings) {
                set = defaultMethodSettings();
            } else if (typeof settings === 'string') {
                set = {
                    ...defaultMethodSettings(settings),
                }
            } else {
                set = combineSettings(targetFunc, settings);
            }

            if (addId) {
                if (set.path &&
                    (
                        (typeof set.path === 'string' && !['', '/'].includes(set.path))
                        || (set.path instanceof RegExp)
                    )

                ) {
                    set.path = `${set.path}/:id`;
                } else {
                    set.path = '/:id';
                }
            }

            const normalized: IMethodOptions = normalizeSettingsInput(set);

            applySettings(targetFunc, normalized);
            targetFunc[HTTP_METHOD] = (method).toLowerCase();
        }
    }
}

export function Restricted(roles: string[] | string) {
    return (target: any, propertyKey: string) => {
        logWarningIfNoAuthentication('Restricted', target, propertyKey);
        target[propertyKey][AUTH] = true;
        target[propertyKey][PRIVATE] = true;

        if (Array.isArray(roles)) {
            target[propertyKey][ROLES] = roles;
        } else {
            target[propertyKey][ROLES] = [roles];
        }
    }
}

export function Roles(roles: string[]) {
    return (target: any, propertyKey: string) => {
        logWarningIfNoAuthentication('Roles', target, propertyKey);
        target[propertyKey][ROLES] = roles;
    }
}

export function Authorized(roles: string[]) {
    return (target: any, propertyKey: string) => {
        logWarningIfNoAuthentication('Authorized', target, propertyKey);
        target[propertyKey][AUTH] = true;
        target[propertyKey][ROLES] = roles;
    }
}

export function Authenticated(settings = {redirect: false}) {
    return (target: any, propertyKey: string) => {
        logWarningIfNoAuthentication('Authenticated', target, propertyKey);
        target[propertyKey][AUTH] = true;
        target[propertyKey][AUTH_REDIRECT] = settings.redirect;
    }
}

export function Admin() {
    return (target: any, propertyKey: string) => {
        logWarningIfNoAuthentication('Admin', target, propertyKey);
        target[propertyKey][AUTH] = true;
        target[propertyKey][PRIVATE] = true;
        target[propertyKey][ROLES] = ['admin'];
    }
}

export function Private() {
    return (target: any, propertyKey: string) => {
        target[propertyKey][PRIVATE] = true;
    }
}


export function Middleware(middlewares?: any) {
    return (target: any, propertyKey: string) => {
        target[propertyKey][PRE_MIDDLEWARE] = middlewares;
    }
}

export function Page(pages: string | string[]) {
    return (target: any, propertyKey: string) => {
        target[propertyKey][PAGE_GEN] = Array.isArray(pages) ? pages : [pages];
    }
}

export function Get(settings?: ModuleMethodDecoratorOptions | string) {
    return generateHttpMethodDecorator('get')(settings);
}

export function Post(settings?: ModuleMethodDecoratorOptions | string) {
    return generateHttpMethodDecorator('post')(settings);
}

export function Put(settings?: ModuleMethodDecoratorOptions | string) {
    return generateHttpMethodDecorator('put')(settings);
}

export function Patch(settings?: ModuleMethodDecoratorOptions | string) {
    return generateHttpMethodDecorator('patch')(settings);
}

export function Delete(settings?: ModuleMethodDecoratorOptions | string) {
    return generateHttpMethodDecorator('delete')(settings);
}

export function GetId(settings?: ModuleMethodDecoratorOptions | string) {
    return generateHttpMethodDecorator('get', true)(settings);
}

export function PutId(settings?: ModuleMethodDecoratorOptions | string) {
    return generateHttpMethodDecorator('put', true)(settings);
}

export function PatchId(settings?: ModuleMethodDecoratorOptions | string) {
    return generateHttpMethodDecorator('patch', true)(settings);
}

export function DeleteId(settings?: ModuleMethodDecoratorOptions | string) {
    return generateHttpMethodDecorator('delete', true)(settings);
}
