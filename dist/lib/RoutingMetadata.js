"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoutingMetadata {
    constructor(target, propertyKey) {
        this._paths = [];
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
        this._target = target;
        this._propertyKey = propertyKey;
    }
    set paths(paths) {
        paths.forEach((path) => this.setPath(path));
    }
    setPaths(paths) {
        Array.isArray(paths) ? this.paths = paths : this.paths = [paths];
    }
    setPath(path) {
        this._paths.push(path);
    }
    set roles(roles) {
        if (!this._roles)
            this._roles = [];
        if (!roles.includes('admin') || !this._roles.includes('admin'))
            roles.push('admin');
        this._roles.push(...roles.map((r) => r.toLowerCase()));
    }
    get paths() {
        return this._paths;
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
    get target() {
        return this._target;
    }
    get propertyKey() {
        return this._propertyKey;
    }
}
exports.default = RoutingMetadata;
