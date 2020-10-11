export declare enum HttpMethod {
    GET = "get",
    POST = "post",
    PATCH = "patch",
    PUT = "put",
    DELETE = "delete"
}
export default class ApiMetaData {
    private _paths;
    private _addId;
    private _method;
    private _preMiddleware;
    private _postMiddleware;
    private _roles?;
    private _authenticated;
    private _unAuthRedirect;
    private _restricted;
    private _pages?;
    private readonly _target;
    private readonly _propertyKey;
    constructor(method: HttpMethod, target: any, propertyKey: string, addId?: boolean);
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
    private setPath;
    set roles(roles: string[]);
    set preMiddlewares(preMiddleware: any | any[]);
    set postMiddlewares(postMiddleware: any | any[]);
    set pages(pages: string[]);
    get paths(): Array<string | RegExp>;
    get method(): string;
    get preMiddlewares(): any | any[];
    get postMiddlewares(): any | any[];
    get roles(): string[];
    get authenticated(): boolean;
    get unAuthRedirect(): boolean;
    get restricted(): boolean;
    get pages(): string[];
    get target(): any;
    get propertyKey(): string;
}
//# sourceMappingURL=ApiMetaData.d.ts.map