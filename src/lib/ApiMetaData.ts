import RoutingMetadata from "./RoutingMetadata";

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    PUT = 'put',
    DELETE = 'delete',
}

export default class ApiMetaData extends RoutingMetadata{
    private _addId: boolean = false;
    private _method: HttpMethod = HttpMethod.GET;
    private _preMiddleware: Array<Function | string> = [];
    private _postMiddleware: Array<Function | string> = [];
    private _pages?: string[];

    constructor(method: HttpMethod, target: any, propertyKey: string, addId: boolean = false) {
        super(target, propertyKey)
        this._method = method;
        this._addId = addId;
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

    get method(): string {
        return this._method.toLowerCase();
    }

    get preMiddlewares() {
        return this._preMiddleware;
    }

    get postMiddlewares() {
        return this._postMiddleware;
    }

    get pages(): string[] {
        return this._pages || [];
    }
}
