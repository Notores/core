import { MiddlewareMetaData } from "../lib";
import { middlewareMetadataKey } from "../symbols";
export function Use(middlewares) {
    return (target, propertyKey) => {
        const existingMiddlewareMetadata = Reflect.getOwnMetadata(middlewareMetadataKey, target[propertyKey]) ?? new MiddlewareMetaData(target, propertyKey);
        if (middlewares) {
            if (typeof middlewares === 'object') {
                if (middlewares.hasOwnProperty('pre'))
                    existingMiddlewareMetadata.isPreMiddleware = middlewares.pre;
                if (middlewares.hasOwnProperty('post'))
                    existingMiddlewareMetadata.isPostMiddleware = middlewares.post;
                if (middlewares.path)
                    existingMiddlewareMetadata.path = middlewares.path;
            }
            else {
                existingMiddlewareMetadata.path = middlewares;
            }
        }
        Reflect.defineMetadata(middlewareMetadataKey, existingMiddlewareMetadata, target[propertyKey]);
    };
}
