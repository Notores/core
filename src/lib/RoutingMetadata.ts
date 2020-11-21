
export default class RoutingMetadata {
    protected _paths: Array<string | RegExp> = [];
    protected _roles?: string[];
    protected _authenticated: boolean = false;
    protected _unAuthRedirect: boolean = false;
    protected _restricted: boolean = false; // Use /n-admin path
    protected readonly _target: any;
    protected readonly _propertyKey: string;

    constructor(target: any, propertyKey: string) {
        this._target = target;
        this._propertyKey = propertyKey;
    }

    isAuthorized = (userRoles: Array<string | { role: string }>) => {
        if (!this._roles) return true;

        for (let i = 0; i < userRoles.length; i++) {
            const r: string | { role: string } = userRoles[i];
            const userRole: string =  (typeof r === 'string' ? r : r.role).toLowerCase();
            if(this._roles.includes(userRole))
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

    set paths(paths: Array<string | RegExp>) {
        paths.forEach((path: string | RegExp) => this.setPath(path))
    }

    public setPaths(paths: Array<string | RegExp> | string | RegExp) {
        Array.isArray(paths) ? this.paths = paths : this.paths = [paths];
    }

    protected setPath(path: string | RegExp) {
        this._paths.push(path);
    }

    set roles(roles: string[]) {
        if (!this._roles) this._roles = [];
        if (!roles.includes('admin') || !this._roles.includes('admin')) roles.push('admin');

        this._roles.push(...roles.map((r: string) => r.toLowerCase()));
    }

    // @ts-ignore
    get paths(): Array<string | RegExp> {
        return this._paths;
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
