import { middlewareMetadataKey, moduleMetadataKey } from "../../symbols";
import { generateRoutingParameters } from "../../decorators";
import { setBody } from "./helpers";
export function bindMiddlewares({ middlewareDeclarationMethods, ...restInput }) {
    middlewareDeclarationMethods.forEach(middlewareDeclarationMethod => bindMiddleware({
        middlewareDeclarationMethod,
        ...restInput
    }));
}
function bindMiddleware({ instance, Clazz, mod, middlewareDeclarationMethod, server }) {
    const moduleMetaData = Reflect.getOwnMetadata(moduleMetadataKey, Clazz);
    const middlewareMetaData = Reflect.getOwnMetadata(middlewareMetadataKey, instance[middlewareDeclarationMethod]);
    const wrapperMiddleware = (routingFunction) => {
        return async (req, res, next) => {
            const useAuthentication = req.config.authentication.enabled;
            if (useAuthentication && middlewareMetaData.authenticated && !req.user) {
                return next();
            }
            const params = generateRoutingParameters(instance, middlewareDeclarationMethod, req, res, next);
            const result = await routingFunction(...params);
            if (result) {
                res.locals.setBody(setBody(result, moduleMetaData));
            }
            next();
        };
    };
    const app = server[middlewareMetaData.restricted ? 'restricted' : 'public'];
    const mids = [];
    const midsObj = {
        METHOD: 'use',
        ROUTE: middlewareMetaData.path,
        RESTRICTED: middlewareMetaData.restricted,
        AUTH: middlewareMetaData.authenticated,
        AUTH_REDIRECT: middlewareMetaData.unAuthRedirect,
        ROLES: middlewareMetaData.roles,
        FUNC: middlewareDeclarationMethod,
    };
    if (!['', '/'].includes(middlewareMetaData.path.toString())) {
        mids.push(middlewareMetaData.path);
    }
    else {
        midsObj.ROUTE = ['ALL'];
    }
    mids.push(wrapperMiddleware(instance[middlewareDeclarationMethod].bind(instance)));
    mod.routes.push(midsObj);
    if (middlewareMetaData.isPreMiddleware) {
        app.preMiddleware.use(...mids);
    }
    if (middlewareMetaData.isPostMiddleware) {
        app.postMiddleware.use(...mids);
    }
}
