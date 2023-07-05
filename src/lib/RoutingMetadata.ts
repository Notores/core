export default class RoutingMetadata {
    protected _path: string | RegExp = '';
    protected _roles?: string[];
    protected _authenticated: boolean = false;
    protected _unAuthRedirect: boolean = false;
    protected _restricted: boolean = false; // Use /n-admin path
    protected readonly _target: any;
    protected readonly _propertyKey: string;
    protected _prefix: string = '';

    constructor(target: any, propertyKey: string) {
        this._target = target;
        this._propertyKey = propertyKey;
    }

    isAuthorized = (userRoles: Array<string | { role: string }>) => {
        if (!this._roles) return true;

        for (let i = 0; i < userRoles.length; i++) {
            const r: string | { role: string } = userRoles[i];
            const userRole: string = (typeof r === 'string' ? r : r.role).toLowerCase();
            if (this._roles.includes(userRole))
                return true;
        }
        return false;
    }

    setAuthenticated = (settings?: { redirect: boolean }) => {
        this._authenticated = true;
        if (settings?.redirect)
            this._unAuthRedirect = settings.redirect;
    }

    setAuthorized = (roles: string[] | string) => {
        this.setAuthenticated();
        this.roles = (Array.isArray(roles) ? roles : [roles]);
    }

    setRestricted = (roles: string[] | string = ['admin']) => {
        this.setAuthenticated();
        this._restricted = true;
        this.roles = (Array.isArray(roles) ? roles : [roles]);
    }

    setAdmin = () => {
        this.setRestricted(['admin']);
    }

    set path(path: string | RegExp) {
        this._path = path;
    }

    addPathPrefix(prefix: string) {
        if (typeof this._path === 'string') {
            if (this._path === '/') {
                this._path = prefix;
                return this;
            }
            let newPath = `${prefix}`
            if (prefix.endsWith('/') || this._path.startsWith('/')) {
                newPath += this._path;
            } else {
                newPath += `/${this._path}`;
            }
            this._path = newPath;
        }
        return this;
    }

    set roles(roles: string[]) {
        if (!this._roles) this._roles = [];
        if (!roles.includes('admin') || !this._roles.includes('admin')) roles.push('admin');

        this._roles.push(...roles.map((r: string) => r.toLowerCase()));
    }

    get path(): string | RegExp {
        let path = this._path;
        if (typeof path !== 'string') return path;

        if (this._prefix !== '') {
            if (this._prefix.endsWith('/') || path.startsWith('/'))
                path = `${this._prefix}${path}`;
            else
                path = `${this._prefix}/${path}`;
        }

        if (this._restricted)
            return `/n-admin${path}`
        return path;
    }

    get roles(): string[] {
        return this._roles || [];
    }

    get authenticated(): boolean {
        return this._authenticated;
    }

    get unAuthRedirect(): boolean {
        return this._unAuthRedirect;
    }

    get restricted(): boolean {
        return this._restricted;
    }

    get target() {
        return this._target;
    }

    get propertyKey(): string {
        return this._propertyKey;
    }
}
