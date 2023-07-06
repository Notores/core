"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotoresServer = void 0;
const express_1 = __importDefault(require("express"));
const lib_1 = require("./lib");
const logger = (0, lib_1.systemLoggerFactory)('@notores/core/server');
let apps;
function createNotoresServer(notores) {
    buildApps();
    const compression = require('compression');
    const bodyParser = require('body-parser');
    const sessions = require('client-sessions');
    const crypto = require('crypto');
    //TODO: add option to notores.json for compression config
    apps.system.use(compression());
    apps.system.use(function notoresXPoweredBy(_, res, next) {
        res.set('X-Powered-By', 'Notores');
        next();
    });
    apps.system.use(function notoresConfig(req, _, next) {
        req.notores = notores;
        req.config = (0, lib_1.getConfig)();
        next();
    });
    apps.system.use(function notoresUseCookieCheck(req, res, next) {
        if (req.config.cookie.useCookie) {
            const noSecretText = 'NO_SECRET_SET_-_PLEASE_SET_A_SECRET';
            let secret = process.env.COOKIE_SECRET || req.config.cookie.secret || noSecretText;
            if (secret === noSecretText && process.env.NODE_ENV !== 'production') {
                logger.error('NO COOKIE SECRET FOUND IN ENVIRONMENT OR IN NOTORES CONFIG FILE!');
            }
            return sessions({
                cookieName: req.config.cookie.name || 'notores',
                requestKey: req.config.cookie.key || 'session',
                secret,
                duration: req.config.cookie.duration || 20 * 7 * 24 * 60 * 60 * 1000,
                activeDuration: req.config.cookie.activeDuration || 20 * 7 * 24 * 60 * 60 * 1000,
                cookie: {
                    httpOnly: req.config.cookie.httpOnly, // when true, cookie is not accessible from javascript
                }
            })(req, res, next);
        }
        return next();
    });
    apps.system.use(function notoresSessionIdCheck(req, res, next) {
        if (!req.config.cookie.useCookie)
            return next();
        if (req.session && !req.session.id) {
            req.session.id = crypto.randomBytes(16).toString('hex');
        }
        next();
    });
    apps.system.use(function notoresBodyParserJson(req, res, next) {
        bodyParser.json({
            limit: req.config.server.requestSizeLimit
        })(req, res, next);
    });
    apps.system.use(function notoresBodyParserUrlEncoded(req, res, next) {
        bodyParser.urlencoded({
            extended: true,
            limit: req.config.server.requestSizeLimit
        })(req, res, next);
    });
    apps.preMiddleware.use(function notoresInitLocals(req, res, next) {
        res.locals = new lib_1.Locals(req, res);
        next();
    });
    apps.restricted.main.use(function notoresRestrictedCheckAuthenticated(req, res, next) {
        if (!req.config.authentication.enabled) {
            return next();
        }
        if (!req.isAuthenticated()) {
            res.locals.statusCode = 401;
            res.locals.error = new Error('Unauthenticated');
        }
        else if (req.user.roles.length === 0) {
            res.locals.statusCode = 403;
            res.locals.error = new Error('Unauthorized');
        }
        return next();
    });
    return apps;
}
exports.createNotoresServer = createNotoresServer;
function buildApps() {
    apps = {
        main: (0, express_1.default)(),
        system: express_1.default.Router(),
        auth: express_1.default.Router(),
        preMiddleware: express_1.default.Router(),
        public: {
            router: express_1.default.Router(),
            preMiddleware: express_1.default.Router(),
            main: express_1.default.Router(),
            postMiddleware: express_1.default.Router(),
            responders: express_1.default.Router(),
        },
        restricted: {
            router: express_1.default.Router(),
            preMiddleware: express_1.default.Router(),
            main: express_1.default.Router(),
            postMiddleware: express_1.default.Router(),
            responders: express_1.default.Router(),
        },
        errorResponders: express_1.default.Router(),
    };
    /** Base **/
    apps.main.use(apps.system);
    apps.main.use(apps.auth);
    apps.main.use(apps.preMiddleware);
    /** Public **/
    apps.main.use(apps.public.router);
    apps.public.router.use(apps.public.preMiddleware);
    apps.public.router.use(apps.public.main);
    apps.public.router.use(apps.public.postMiddleware);
    apps.public.router.use(apps.public.responders);
    apps.public.responders.use(lib_1.responseHandler);
    /** Restricted **/
    apps.main.use('/n-admin', apps.restricted.router);
    apps.restricted.router.use(apps.restricted.preMiddleware);
    apps.restricted.router.use(apps.restricted.main);
    apps.restricted.router.use(apps.restricted.postMiddleware);
    apps.restricted.router.use(apps.restricted.responders);
    apps.restricted.responders.use(lib_1.responseHandler);
    /** Error Responder **/
    apps.main.use(apps.errorResponders);
    apps.errorResponders.use(lib_1.errorResponseHandler);
}
