import RoutingMetadata from "./RoutingMetadata";

export class MiddlewareMetaData extends RoutingMetadata {
    #isPreMiddleware: boolean = true;
    #isPostMiddleware: boolean = false;

    constructor(target: any, propertyKey: string) {
        super(target, propertyKey)
    }

    set isPreMiddleware(isPre: boolean) {
        this.#isPreMiddleware = isPre
    }

    get isPreMiddleware(): boolean {
        return this.#isPreMiddleware;
    }

    set isPostMiddleware(isPost: boolean) {
        this.#isPostMiddleware = isPost
    }

    get isPostMiddleware(): boolean {
        return this.#isPostMiddleware;
    }
}
