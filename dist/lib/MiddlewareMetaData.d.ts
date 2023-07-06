import RoutingMetadata from "./RoutingMetadata";
export declare class MiddlewareMetaData extends RoutingMetadata {
    #private;
    constructor(target: any, propertyKey: string);
    set isPreMiddleware(isPre: boolean);
    get isPreMiddleware(): boolean;
    set isPostMiddleware(isPost: boolean);
    get isPostMiddleware(): boolean;
}
