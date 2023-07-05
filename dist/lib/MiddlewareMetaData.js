import RoutingMetadata from "./RoutingMetadata";
export class MiddlewareMetaData extends RoutingMetadata {
    #isPreMiddleware = true;
    #isPostMiddleware = false;
    constructor(target, propertyKey) {
        super(target, propertyKey);
    }
    set isPreMiddleware(isPre) {
        this.#isPreMiddleware = isPre;
    }
    get isPreMiddleware() {
        return this.#isPreMiddleware;
    }
    set isPostMiddleware(isPost) {
        this.#isPostMiddleware = isPost;
    }
    get isPostMiddleware() {
        return this.#isPostMiddleware;
    }
}
