"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServers = exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
require("./namespace/Notores");
const logger_1 = require("./lib/logger");
const Responder_1 = __importDefault(require("./lib/Responder"));
const logger = logger_1.loggerFactory(module);
const apps = {
    main: express_1.default(),
    system: express_1.default(),
    preMiddleware: express_1.default(),
    public: {
        main: express_1.default(),
        preMiddleware: express_1.default(),
        router: express_1.default(),
        postMiddleware: express_1.default(),
    },
    restricted: {
        main: express_1.default(),
        preMiddleware: express_1.default(),
        router: express_1.default(),
        postMiddleware: express_1.default(),
    },
};
function createServer() {
    const passport = require('passport');
    const compression = require('compression');
    const bodyParser = require('body-parser');
    const sessions = require('client-sessions');
    const crypto = require('crypto');
    const { getConfig } = require('./lib/config');
    const locals = require('./lib/Locals');
    const config = getConfig();
    const mainConfig = config.main || {};
    const serverConfig = mainConfig.server || { requestSizeLimit: '1mb' };
    apps.main.use(compression());
    apps.main.use((req, res, next) => {
        res.header('X-Powered-By', 'Notores');
        next();
    });
    apps.main.use(apps.system);
    apps.system.use((req, res, next) => {
        req.notores = getConfig();
        next();
    });
    apps.system.use((req, res, next) => {
        if (req.notores.main.useCookie) {
            const secret = process.env.COOKIE_SECRET || req.notores.main.cookieSecret || 'NO_SECRET_SET_DO_SET_A_SECRET!';
            if (secret === 'NO_SECRET_SET_DO_SET_A_SECRET!' && process.env.NODE_ENV !== 'production') {
                logger.error(`NO COOKIE SECRET FOUND IN ENVIRONMENT OR IN NOTORES CONFIG FILE!`);
            }
            return sessions({
                cookieName: 'notores',
                requestKey: 'session',
                secret: process.env.COOKIE_SECRET || 'BASE KEY',
                duration: 20 * 7 * 24 * 60 * 60 * 1000,
                activeDuration: 20 * 7 * 24 * 60 * 60 * 1000,
                cookie: {
                    httpOnly: true,
                }
            })(req, res, next);
        }
        return next();
    });
    apps.system.use((req, res, next) => {
        if (!req.notores.main.useCookie)
            return next();
        if (req.session && !req.session.id) {
            const buf = crypto.randomBytes(16);
            req.session.id = buf.toString('hex');
            // console.log(req.wsSession);
        }
        next();
    });
    apps.system.use(Responder_1.default.serverStatic);
    apps.system.use(bodyParser.json({ limit: serverConfig.requestSizeLimit }));
    apps.system.use(bodyParser.urlencoded({ extended: true, limit: serverConfig.requestSizeLimit }));
    if (mainConfig.authentication.enabled) {
        apps.system.use(passport.initialize());
        apps.system.use(passport.session());
        apps.system.use((req, res, next) => {
            if (req.isAuthenticated())
                return next();
            passport.authenticate('jwt', (err, user, info) => {
                if (user) {
                    return req.login(user, () => {
                        next();
                    });
                }
                return next();
            })(req, res, next);
        });
    }
    apps.system.use(locals);
    apps.main.use(apps.preMiddleware);
    apps.main.use(apps.public.main);
    apps.public.main.use(apps.public.preMiddleware);
    apps.public.main.use(apps.public.router);
    apps.public.main.use(apps.public.postMiddleware);
    apps.main.use('/n-admin', apps.restricted.main);
    if (mainConfig.authentication.enabled) {
        apps.restricted.main.use((req, res, next) => {
            if (!req.isAuthenticated()) {
                if (res.locals.type === 'html') {
                    // console.log('redirecting to login...');
                    return res.redirect('/login');
                }
                else {
                    res.locals.error = { status: 401, message: 'Unauthenticated' };
                }
            }
            else {
                if (req.user.roles.length === 0) {
                    if (res.locals.type === 'html') {
                        return res.redirect('/profile');
                    }
                    else {
                        res.locals.error = { status: 403, message: 'Unauthorized' };
                    }
                }
            }
            return next();
        });
    }
    apps.restricted.main.use((req, res, next) => {
        if (res.locals.hasError) {
            return Responder_1.default.jsonResponder(req, res, next);
        }
        return next();
    });
    apps.restricted.main.use(Responder_1.default.serverStatic);
    apps.restricted.main.use(apps.restricted.preMiddleware);
    apps.restricted.main.use(apps.restricted.router);
    apps.restricted.main.use(apps.restricted.postMiddleware);
    apps.restricted.main.use(Responder_1.default.responseHandler);
    apps.main.use(Responder_1.default.responseHandler);
    return apps;
}
exports.createServer = createServer;
function getServers() {
    return apps;
}
exports.getServers = getServers;
