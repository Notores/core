import RoutingMetadata from "./RoutingMetadata";

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    PUT = 'put',
    DELETE = 'delete',
}

export default class ApiMetaData extends RoutingMetadata {
    private _templateAccess: boolean = false;
    private _contentType?: string = undefined;
    private _accepts: string[] = ['json'];
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

    set templateAccess(value: boolean) {
        this._templateAccess = value;
    }

    set contentType(value: string | undefined) {
        this._contentType = value;
    }

    set accepts(value: string[]) {
        this._accepts.push(...(Array.isArray(value) ? value : [value]));
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

    get templateAccess(): boolean {
        return this._templateAccess;
    }

    get contentType() {
        return this._contentType;
    }

    get accepts(): string[] {
        return this._accepts;
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
