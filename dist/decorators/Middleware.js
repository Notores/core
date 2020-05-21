"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Use = void 0;
const constants_1 = require("../constants");
function defaultMiddlewareSettings(obj) {
    return {
        path: typeof obj === 'string' ? obj : (obj === null || obj === void 0 ? void 0 : obj.PATH_ROUTE) || '',
        pre: true,
        post: false,
        roles: [],
        authenticated: false,
        private: false,
    };
}
function Use(middlewares) {
    return (target, propertyKey) => {
        const targetFunc = target[propertyKey];
        const set = defaultMiddlewareSettings();
        targetFunc[constants_1.PATH_ROUTE] = set.path;
        targetFunc[constants_1.ROLES] = set.roles;
        targetFunc[constants_1.AUTH] = set.authenticated;
        targetFunc[constants_1.PRIVATE] = set.private;
        targetFunc[constants_1.PATH_ROUTE] = '';
        targetFunc[constants_1.MIDDLEWARE] = true;
        if (middlewares) {
            if (middlewares.path) {
                targetFunc[constants_1.PATH_ROUTE] = middlewares.path;
            }
            if (middlewares.authenticated) {
                targetFunc[constants_1.AUTH] = true;
            }
            if (middlewares.hasOwnProperty('pre')) {
                targetFunc[constants_1.IS_PRE_MIDDLEWARE] = true;
                targetFunc[constants_1.IS_POST_MIDDLEWARE] = false;
            }
            else if (middlewares.hasOwnProperty('post')) {
                targetFunc[constants_1.IS_PRE_MIDDLEWARE] = false;
                targetFunc[constants_1.IS_POST_MIDDLEWARE] = true;
            }
        }
        else {
            targetFunc[constants_1.IS_PRE_MIDDLEWARE] = true;
        }
    };
}
exports.Use = Use;
