"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteId = exports.PatchId = exports.PutId = exports.GetId = exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = exports.Page = exports.Middleware = exports.Private = exports.Admin = exports.Authenticated = exports.Authorized = exports.Roles = exports.Restricted = void 0;
const constants_1 = require("../constants");
const logger_1 = __importDefault(require("../lib/logger"));
const logger = logger_1.default(module);
function defaultMethodSettings(obj) {
    return {
        path: typeof obj === 'string' ? obj : (obj === null || obj === void 0 ? void 0 : obj.PATH_ROUTE) || '',
        pre: [],
        post: [],
        roles: [],
        authenticated: false,
        private: false,
        pages: [],
    };
}
function getSettings(set) {
    const base = {
        ...defaultMethodSettings(set),
    };
    const { PATH_ROUTE, PRE_MIDDLEWARE, POST_MIDDLEWARE, PRIVATE, AUTH, ROLES } = set;
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
function normalizeSettingsInput(input) {
    return {
        authenticated: input.authenticated,
        path: input.path,
        post: Array.isArray(input.post) ? input.post : [input.post],
        pre: Array.isArray(input.pre) ? input.pre : [input.pre],
        private: input.private,
        roles: Array.isArray(input.roles) ? input.roles : [input.roles],
        pages: Array.isArray(input.pages) ? input.pages : [input.pages],
    };
}
function combineSettings(targetFunction, input) {
    const settings = {
        ...defaultMethodSettings(targetFunction),
        ...getSettings(targetFunction),
    };
    const newSettings = normalizeSettingsInput(settings);
    if (input.path) {
        if (newSettings.path === '') {
            newSettings.path = input.path;
        }
        else {
            logger.warn(`Path is already set, skipping settings path. Old: ${newSettings.path}. New: ${settings.path}`);
        }
    }
    if (input.pre) {
        const mids = Array.isArray(input.pre) ? input.pre : [input.pre];
        newSettings.pre.push(...mids);
    }
    if (input.post) {
        const mids = Array.isArray(input.post) ? input.post : [input.post];
        newSettings.post.push(...mids);
    }
    if (input.authenticated) {
        newSettings.authenticated = input.authenticated;
    }
    if (input.pages) {
        newSettings.pages.push(...input.pages);
    }
    return newSettings;
}
function applySettings(target, settings) {
    target[constants_1.PATH_ROUTE] = settings.path || '/';
    target[constants_1.PRE_MIDDLEWARE] = settings.pre;
    target[constants_1.POST_MIDDLEWARE] = settings.post;
    target[constants_1.ROLES] = settings.roles;
    target[constants_1.AUTH] = settings.authenticated;
    target[constants_1.PRIVATE] = settings.private;
}
function generateHttpMethodDecorator(method, addId = false) {
    return function Path(settings) {
        return function (target, propertyKey) {
            const targetFunc = target[propertyKey];
            let set;
            if (!settings) {
                set = defaultMethodSettings();
            }
            else if (typeof settings === 'string') {
                set = {
                    ...defaultMethodSettings(settings),
                };
            }
            else {
                set = combineSettings(targetFunc, settings);
            }
            if (addId) {
                if (set.path &&
                    ((typeof set.path === 'string' && !['', '/'].includes(set.path))
                        || (set.path instanceof RegExp))) {
                    set.path = `${set.path}/:id`;
                }
                else {
                    set.path = '/:id';
                }
            }
            const normalized = normalizeSettingsInput(set);
            applySettings(targetFunc, normalized);
            targetFunc[constants_1.HTTP_METHOD] = (method).toLowerCase();
        };
    };
}
function Restricted(roles) {
    return (target, propertyKey) => {
        target[propertyKey][constants_1.AUTH] = true;
        target[propertyKey][constants_1.PRIVATE] = true;
        if (Array.isArray(roles)) {
            target[propertyKey][constants_1.ROLES] = roles;
        }
        else if (typeof roles === 'string') {
            target[propertyKey][constants_1.ROLES] = [roles];
        }
    };
}
exports.Restricted = Restricted;
function Roles(roles = []) {
    return (target, propertyKey) => {
        target[propertyKey][constants_1.ROLES] = roles;
    };
}
exports.Roles = Roles;
function Authorized(roles = []) {
    return (target, propertyKey) => {
        target[propertyKey][constants_1.AUTH] = true;
        target[propertyKey][constants_1.ROLES] = roles;
    };
}
exports.Authorized = Authorized;
function Authenticated(settings = { redirect: false }) {
    return (target, propertyKey) => {
        target[propertyKey][constants_1.AUTH] = true;
        target[propertyKey][constants_1.AUTH_REDIRECT] = settings.redirect;
    };
}
exports.Authenticated = Authenticated;
function Admin() {
    return (target, propertyKey) => {
        target[propertyKey][constants_1.AUTH] = true;
        target[propertyKey][constants_1.PRIVATE] = true;
        target[propertyKey][constants_1.ROLES] = ['admin'];
    };
}
exports.Admin = Admin;
function Private() {
    return (target, propertyKey) => {
        target[propertyKey][constants_1.PRIVATE] = true;
    };
}
exports.Private = Private;
function Middleware(middlewares) {
    return (target, propertyKey) => {
        target[propertyKey][constants_1.PRE_MIDDLEWARE] = middlewares;
    };
}
exports.Middleware = Middleware;
function Page(pages) {
    return (target, propertyKey) => {
        target[propertyKey][constants_1.PAGE_GEN] = Array.isArray(pages) ? pages : [pages];
    };
}
exports.Page = Page;
function Get(settings) {
    return generateHttpMethodDecorator('get')(settings);
}
exports.Get = Get;
function Post(settings) {
    return generateHttpMethodDecorator('post')(settings);
}
exports.Post = Post;
function Put(settings) {
    return generateHttpMethodDecorator('put')(settings);
}
exports.Put = Put;
function Patch(settings) {
    return generateHttpMethodDecorator('patch')(settings);
}
exports.Patch = Patch;
function Delete(settings) {
    return generateHttpMethodDecorator('delete')(settings);
}
exports.Delete = Delete;
function GetId(settings) {
    return generateHttpMethodDecorator('get', true)(settings);
}
exports.GetId = GetId;
function PutId(settings) {
    return generateHttpMethodDecorator('put', true)(settings);
}
exports.PutId = PutId;
function PatchId(settings) {
    return generateHttpMethodDecorator('patch', true)(settings);
}
exports.PatchId = PatchId;
function DeleteId(settings) {
    return generateHttpMethodDecorator('delete', true)(settings);
}
exports.DeleteId = DeleteId;
