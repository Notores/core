import RoutingMetadata from "./RoutingMetadata";
export declare enum HttpMethod {
    GET = "get",
    POST = "post",
    PATCH = "patch",
    PUT = "put",
    DELETE = "delete"
}
export default class ApiMetaData extends RoutingMetadata {
    private _templateAccess;
    private _contentType?;
    private _accepts;
    private _addId;
    private _method;
    private _preMiddleware;
    private _postMiddleware;
    private _pages?;
    constructor(method: HttpMethod, target: any, propertyKey: string, addId?: boolean);
    set templateAccess(value: boolean);
    set contentType(value: string | undefined);
    set accepts(value: string[]);
    set preMiddlewares(preMiddleware: any | any[]);
    set postMiddlewares(postMiddleware: any | any[]);
    set pages(pages: string[]);
    get templateAccess(): boolean;
    get contentType(): string | undefined;
    get accepts(): string[];
    get method(): string;
    get preMiddlewares(): any | any[];
    get postMiddlewares(): any | any[];
    get pages(): string[];
}
//# sourceMappingURL=ApiMetaData.d.ts.map