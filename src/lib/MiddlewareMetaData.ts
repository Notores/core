import RoutingMetadata from "./RoutingMetadata";

export default class MiddlewareMetaData extends RoutingMetadata{
    private _isPreMiddleware: boolean = true;
    private _isPostMiddleware: boolean = false;

    constructor(target: any, propertyKey: string) {
        super(target, propertyKey)
    }

    set isPreMiddleware(isPre: boolean) {
        this._isPreMiddleware = isPre
    }

    get isPreMiddleware(): boolean {
        return this._isPreMiddleware;
    }

    set isPostMiddleware(isPost: boolean) {
        this._isPostMiddleware = isPost
    }

    get isPostMiddleware(): boolean {
        return this._isPostMiddleware;
    }
}
