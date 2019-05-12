const {join} = require('path');
const mongoose = require('mongoose');
const {responseHandler} = require("./responseHandler");
const logger = require('../logger')(module);
const registry = [];

function handleActive(handle) {
    return (req, res, next) => {
        const handleInfo = registry.find(entry => entry.handle === handle);

        if (!handleInfo || handleInfo.active === false)
            next('route');
        else if (handleInfo.active === true)
            next();
        else
            next('route');
    }
}

function addRouteToRegistry(handle, path, method) {
    registry.push({handle, path, method, active: true});
}

function routeWithHandle(handle, path, middlewares = [], {method = 'get', accepts = ['json'], authenticated = false, admin = false, roles = []} = {}) {
    const server = require('../server');

    if (!Array.isArray(middlewares))
        middlewares = [middlewares];

    addRouteToRegistry(handle, path, method);

    if (accepts) {
        if (!Array.isArray(accepts)) {
            accepts = [accepts];
        }
        middlewares.unshift(checkAcceptsHeaders(accepts));
    }
    if (roles) {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
    }

    const routers = server.getServers();
    const router = admin ? routers.private.router : routers.public.router;

    if (!router) {
        return logger.error(`Server has not been created yet. Cannot add route ${method.toUpperCase()}:${path} with handle ${handle}`);
    }

    router[method](path, handleActive(handle), ...middlewares);
}

function middlewareForRouter(middlewares = [], {when = 'pre', accepts = ['json', 'html'], path, level = 'public'} = {}) {
    const server = require('../server');

    if (!Array.isArray(middlewares))
        middlewares = [middlewares];

    if (accepts) {
        if (!Array.isArray(accepts)) {
            accepts = [accepts];
        }
        middlewares.unshift(checkAcceptsHeaders(accepts));
    }

    if (path)
        middlewares.unshift(checkAcceptsHeaders(accepts, false));

    const routers = server.getServers();
    let app;
    switch (level) {
        case 'main':
            app = routers.preMiddleware;
            break;
        case 'private':
            app = when === 'pre' ? routers.private.preMiddleware : routers.private.postMiddleware;
            break;
        default:
            app = when === 'pre' ? routers.public.preMiddleware : routers.public.postMiddleware;
    }

    if (!app) {
        return logger.error(`Server has not been created yet. Cannot add route ${method.toUpperCase()}:${path} with handle ${handle}`);
    }

    app.use(...middlewares)
}

const checkAcceptsHeaders = (headers, setResponseType = true) => {
    return (req, res, next) => {
        const acceptedHeaders = Array.isArray(headers) ? [...headers] : [headers];

        const accepted = req.accepts(acceptedHeaders);

        logger.info(`accepted ${accepted}`);

        if (!accepted) {
            return next(new Error(acceptedHeaders));
        }

        if (setResponseType) {
            // TODO: JSON is default, but should it also have priority?
            if (accepted.indexOf('html') > -1 || accepted.indexOf('text') > -1) {
                res.locals.type = 'html';
            } else if (accepted.indexOf('xml') > -1) {
                res.locals.type = 'xml';
            }
        }

        // default is json
        return next();
    };
};

function getRegistry() {
    return registry;
}

const getThemePath = (themeConfig, admin = false) => {
    return join(
        process.cwd(),
        './public',
        './themes',
        admin ? `/${themeConfig.private.name}` || '/notores' : `/${themeConfig.public.name}` || '/notores',
        admin ? '/private' : '/public'
    )
};

function checkEmptyParams(req, res, next) {
    const keys = Object.keys(req.params || {});

    if (keys.length === 0) {
        return next('route');
    } else {
        return next();
    }
}

function checkParamIsObjectId(paramName) {
    return (req, res, next) => {
        try {
            mongoose.Types.ObjectId(req.params[paramName]);
        } catch (e) {
            return next('route');
        }
    }
}

//TODO: Create middleware for handling admin routes

module.exports = {
    routeWithHandle,
    middlewareForRouter,
    checkAcceptsHeaders,
    addRouteToRegistry,
    handleActive,
    getRegistry,
    getThemePath,
    checkEmptyParams,
    checkParamIsObjectId
};
