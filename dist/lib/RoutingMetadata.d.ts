export default class RoutingMetadata {
    protected _path: string | RegExp;
    protected _roles?: string[];
    protected _authenticated: boolean;
    protected _unAuthRedirect: boolean;
    protected _restricted: boolean;
    protected readonly _target: any;
    protected readonly _propertyKey: string;
    protected _prefix: string;
    constructor(target: any, propertyKey: string);
    isAuthorized: (userRoles: Array<string | {
        role: string;
    }>) => boolean;
    setAuthenticated: (settings?: {
        redirect: boolean;
    }) => void;
    setAuthorized: (roles: string[] | string) => void;
    setRestricted: (roles?: string[] | string) => void;
    setAdmin: () => void;
    set path(path: string | RegExp);
    addPathPrefix(prefix: string): this;
    set roles(roles: string[]);
    get path(): string | RegExp;
    get roles(): string[];
    get authenticated(): boolean;
    get unAuthRedirect(): boolean;
    get restricted(): boolean;
    get target(): any;
    get propertyKey(): string;
}
