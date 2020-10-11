"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = void 0;
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "get";
    HttpMethod["POST"] = "post";
    HttpMethod["PATCH"] = "patch";
    HttpMethod["PUT"] = "put";
    HttpMethod["DELETE"] = "delete";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
class ApiMetaData {
    constructor(method, target, propertyKey, addId = false) {
        this._paths = [];
        this._addId = false;
        this._method = HttpMethod.GET;
        this._preMiddleware = [];
        this._postMiddleware = [];
        this._authenticated = false;
        this._unAuthRedirect = false;
        this._restricted = false; // Use /n-admin path
        this.isAuthorized = (userRoles) => {
            if (!this._roles)
                return true;
            for (let i = 0; i < userRoles.length; i++) {
                const r = userRoles[i];
                const userRole = (typeof r === 'string' ? r : r.role).toLowerCase();
                if (this._roles.includes(userRole))
                    return true;
            }
            return false;
        };
        this.setAuthenticated = (settings) => {
            this._authenticated = true;
            if (settings === null || settings === void 0 ? void 0 : settings.redirect)
                this._unAuthRedirect = settings.redirect;
        };
        this.setAuthorized = (roles) => {
            this.setAuthenticated();
            this.roles = (Array.isArray(roles) ? roles : [roles]);
        };
        this.setRestricted = (roles = ['admin']) => {
            this.setAuthenticated();
            this._restricted = true;
            this.roles = (Array.isArray(roles) ? roles : [roles]);
        };
        this.setAdmin = () => {
            this.setRestricted(['admin']);
        };
        this._method = method;
        this._target = target;
        this._propertyKey = propertyKey;
    }
    set paths(paths) {
        Array.isArray(paths) ? paths.forEach((path) => this.setPath(path)) : this.setPath(paths);
    }
    setPath(path) {
        this._paths.push(this._addId && typeof path === 'string' ? `${path}/:id` : path);
    }
    set roles(roles) {
        if (!this._roles)
            this._roles = [];
        if (!roles.includes('admin') || !this._roles.includes('admin'))
            roles.push('admin');
        this._roles.push(...roles.map((r) => r.toLowerCase()));
    }
    set preMiddlewares(preMiddleware) {
        this._preMiddleware.push(...(Array.isArray(preMiddleware) ? preMiddleware : [preMiddleware]));
    }
    set postMiddlewares(postMiddleware) {
        this._postMiddleware.push(...(Array.isArray(postMiddleware) ? postMiddleware : [postMiddleware]));
    }
    set pages(pages) {
        if (!this._pages)
            this._pages = [];
        this._pages.push(...Array.isArray(pages) ? pages : [pages]);
    }
    get paths() {
        return this._paths;
    }
    get method() {
        return this._method.toLowerCase();
    }
    get preMiddlewares() {
        return this._preMiddleware;
    }
    get postMiddlewares() {
        return this._postMiddleware;
    }
    get roles() {
        return this._roles || [];
    }
    get authenticated() {
        return this._authenticated;
    }
    get unAuthRedirect() {
        return this._unAuthRedirect;
    }
    get restricted() {
        return this._restricted;
    }
    get pages() {
        return this._pages || [];
    }
    get target() {
        return this._target;
    }
    get propertyKey() {
        return this._propertyKey;
    }
}
exports.default = ApiMetaData;
