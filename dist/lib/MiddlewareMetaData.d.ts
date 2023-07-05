import RoutingMetadata from "./RoutingMetadata";
export default class MiddlewareMetaData extends RoutingMetadata {
    private _isPreMiddleware;
    private _isPostMiddleware;
    constructor(target: any, propertyKey: string);
    set isPreMiddleware(isPre: boolean);
    get isPreMiddleware(): boolean;
    set isPostMiddleware(isPost: boolean);
    get isPostMiddleware(): boolean;
}
//# sourceMappingURL=MiddlewareMetaData.d.ts.map