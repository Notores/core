export default class RoutingMetadata {
    protected _paths: Array<string | RegExp>;
    protected _roles?: string[];
    protected _authenticated: boolean;
    protected _unAuthRedirect: boolean;
    protected _restricted: boolean;
    protected readonly _target: any;
    protected readonly _propertyKey: string;
    constructor(target: any, propertyKey: string);
    isAuthorized: (userRoles: Array<string | {
        role: string;
    }>) => boolean;
    setAuthenticated: (settings?: {
        redirect: boolean;
    } | undefined) => void;
    setAuthorized: (roles: string[] | string) => void;
    setRestricted: (roles?: string[] | string) => void;
    setAdmin: () => void;
    set paths(paths: Array<string | RegExp>);
    setPaths(paths: Array<string | RegExp> | string | RegExp): void;
    protected setPath(path: string | RegExp): void;
    set roles(roles: string[]);
    get paths(): Array<string | RegExp>;
    get roles(): string[];
    get authenticated(): boolean;
    get unAuthRedirect(): boolean;
    get restricted(): boolean;
    get target(): any;
    get propertyKey(): string;
}
//# sourceMappingURL=RoutingMetadata.d.ts.map