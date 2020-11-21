import RoutingMetadata from "./RoutingMetadata";
export declare enum HttpMethod {
    GET = "get",
    POST = "post",
    PATCH = "patch",
    PUT = "put",
    DELETE = "delete"
}
export default class ApiMetaData extends RoutingMetadata {
    private _addId;
    private _method;
    private _preMiddleware;
    private _postMiddleware;
    private _pages?;
    constructor(method: HttpMethod, target: any, propertyKey: string, addId?: boolean);
    set preMiddlewares(preMiddleware: any | any[]);
    set postMiddlewares(postMiddleware: any | any[]);
    set pages(pages: string[]);
    get method(): string;
    get preMiddlewares(): any | any[];
    get postMiddlewares(): any | any[];
    get pages(): string[];
}
//# sourceMappingURL=ApiMetaData.d.ts.map