export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    PUT = 'put',
    DELETE = 'delete',
}

export default class ApiMetaData {
    private _paths: Array<string | RegExp> = [];
    private _addId: boolean = false;
    private _method: HttpMethod = HttpMethod.GET;
    private _preMiddleware: Array<Function | string> = [];
    private _postMiddleware: Array<Function | string> = [];
    private _roles?: string[];
    private _authenticated: boolean = false;
    private _unAuthRedirect: boolean = false;
    private _restricted: boolean = false; // Use /n-admin path
    private _pages?: string[];
    private readonly _target: any;
    private readonly _propertyKey: string;

    constructor(method: HttpMethod, target: any, propertyKey: string, addId: boolean = false) {
        this._method = method;
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
        Array.isArray(paths) ? paths.forEach((path: string | RegExp) => this.setPath(path)) : this.setPath(paths);
    }

    private setPath(path: string | RegExp) {
        this._paths.push(this._addId && typeof path === 'string' ? `${path}/:id` : path);
    }

    set roles(roles: string[]) {
        if (!this._roles) this._roles = [];
        if (!roles.includes('admin') || !this._roles.includes('admin')) roles.push('admin');

        this._roles.push(...roles.map((r: string) => r.toLowerCase()));
    }

    set preMiddlewares(preMiddleware: any | any[]) {
        this._preMiddleware.push(...(Array.isArray(preMiddleware) ? preMiddleware : [preMiddleware]));
    }

    set postMiddlewares(postMiddleware: any | any[]) {
        this._postMiddleware.push(...(Array.isArray(postMiddleware) ? postMiddleware : [postMiddleware]));
    }

    set pages(pages: string[]) {
        if (!this._pages) this._pages = [];
        this._pages.push(...Array.isArray(pages) ? pages : [pages])
    }

    get paths(): Array<string | RegExp> {
        return this._paths;
    }

    get method(): string {
        return this._method.toLowerCase();
    }

    get preMiddlewares() {
        return this._preMiddleware;
    }

    get postMiddlewares() {
        return this._postMiddleware;
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

    get pages(): string[] {
        return this._pages || [];
    }

    get target() {
        return this._target;
    }

    get propertyKey(): string {
        return this._propertyKey;
    }
}
