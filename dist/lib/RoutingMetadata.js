export default class RoutingMetadata {
    _path = '';
    _roles;
    _authenticated = false;
    _unAuthRedirect = false;
    _restricted = false; // Use /n-admin path
    _target;
    _propertyKey;
    _prefix = '';
    constructor(target, propertyKey) {
        this._target = target;
        this._propertyKey = propertyKey;
    }
    isAuthorized = (userRoles) => {
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
    setAuthenticated = (settings) => {
        this._authenticated = true;
        if (settings?.redirect)
            this._unAuthRedirect = settings.redirect;
    };
    setAuthorized = (roles) => {
        this.setAuthenticated();
        this.roles = (Array.isArray(roles) ? roles : [roles]);
    };
    setRestricted = (roles = ['admin']) => {
        this.setAuthenticated();
        this._restricted = true;
        this.roles = (Array.isArray(roles) ? roles : [roles]);
    };
    setAdmin = () => {
        this.setRestricted(['admin']);
    };
    set path(path) {
        this._path = path;
    }
    addPathPrefix(prefix) {
        if (typeof this._path === 'string') {
            if (this._path === '/') {
                this._path = prefix;
                return this;
            }
            let newPath = `${prefix}`;
            if (prefix.endsWith('/') || this._path.startsWith('/')) {
                newPath += this._path;
            }
            else {
                newPath += `/${this._path}`;
            }
            this._path = newPath;
        }
        return this;
    }
    set roles(roles) {
        if (!this._roles)
            this._roles = [];
        if (!roles.includes('admin') || !this._roles.includes('admin'))
            roles.push('admin');
        this._roles.push(...roles.map((r) => r.toLowerCase()));
    }
    get path() {
        let path = this._path;
        if (typeof path !== 'string')
            return path;
        if (this._prefix !== '') {
            if (this._prefix.endsWith('/') || path.startsWith('/'))
                path = `${this._prefix}${path}`;
            else
                path = `${this._prefix}/${path}`;
        }
        if (this._restricted)
            return `/n-admin${path}`;
        return path;
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
