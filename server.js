"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routeUtils_1 = require("./lib/routeUtils");
const express_1 = __importDefault(require("express"));
const logger_1 = require("./logger");
const logger = logger_1.initLogger(module);
const apps = {
    main: express_1.default(),
    preMiddleware: express_1.default(),
    public: {
        main: express_1.default(),
        preMiddleware: express_1.default(),
        router: express_1.default(),
        postMiddleware: express_1.default(),
    },
    private: {
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
    const responseHandler = require('./lib/responseHandler');
    const config = getConfig();
    const mainConfig = config.main || {};
    const serverConfig = mainConfig.server || { requestSizeLimit: '1mb' };
    apps.main.use(compression());
    apps.main.use((req, res, next) => {
        res.header('X-Powered-By', 'Notores');
        next();
    });
    apps.main.use((req, res, next) => {
        req.notores = getConfig();
        next();
    });
    apps.main.use((req, res, next) => {
        if (req.notores.main.useCookie) {
            return sessions({
                cookieName: 'notores',
                requestKey: 'session',
                secret: process.env.COOKIE_SECRET,
                duration: 20 * 7 * 24 * 60 * 60 * 1000,
                activeDuration: 20 * 7 * 24 * 60 * 60 * 1000,
                cookie: {
                    httpOnly: true,
                }
            })(req, res, next);
        }
        return next();
    });
    apps.main.use((req, res, next) => {
        if (!req.notores.main.useCookie)
            return next();
        if (req.session && !req.session.id) {
            const buf = crypto.randomBytes(16);
            req.session.id = buf.toString('hex');
            // console.log(req.wsSession);
        }
        next();
    });
    apps.main.use(bodyParser.json({ limit: serverConfig.requestSizeLimit }));
    apps.main.use(bodyParser.urlencoded({ extended: true, limit: serverConfig.requestSizeLimit }));
    apps.main.use(passport.initialize());
    apps.main.use(passport.session());
    apps.main.use((req, res, next) => {
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
    apps.main.use(locals);
    apps.main.use(apps.preMiddleware);
    apps.main.use(apps.public.main);
    apps.public.main.use(apps.public.preMiddleware);
    apps.public.main.use(apps.public.router);
    apps.public.main.use(apps.public.postMiddleware);
    apps.main.use('/n-admin', apps.private.main);
    apps.private.main.use((req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }
        //@ts-ignore
        if (req.user.roles.length === 0) {
            return res.redirect('/profile');
        }
        return next();
    });
    apps.private.main.use(apps.private.preMiddleware);
    apps.private.main.use(apps.private.router);
    apps.private.main.use(apps.private.postMiddleware);
    apps.private.main.use(routeUtils_1.checkAcceptsHeaders(['html', 'json']), responseHandler.responseHandler);
    apps.main.use(routeUtils_1.checkAcceptsHeaders(['html', 'json']), responseHandler.responseHandler);
    return apps;
}
exports.createServer = createServer;
function startServer(port = process.env.PORT) {
    if (!port)
        port = 3000;
    if (!apps.main)
        createServer();
    apps.main.listen(port, () => {
        logger.info(`Server started, listening on port:${port}`);
        if (process.env.NODE_ENV === 'development')
            logger.info(`Server can be reached on http://localhost:${port}`);
    });
}
exports.startServer = startServer;
function getServers() {
    return apps;
}
exports.getServers = getServers;
