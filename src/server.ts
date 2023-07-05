import express, {Request, Response, NextFunction} from 'express';
import {getConfig, systemLoggerFactory, errorResponseHandler, responseHandler, Locals} from './lib';
import { Notores } from './types/Notores';

const logger = systemLoggerFactory('@notores/core/server');

let apps: Notores.Server;

export function createNotoresServer(notores: Notores.Application): Notores.Server {
    buildApps();
    const compression = require('compression');
    const bodyParser = require('body-parser');
    const sessions = require('client-sessions');
    const crypto = require('crypto');

    //TODO: add option to notores.json for compression config
    apps.system.use(compression());
    apps.system.use(function notoresXPoweredBy (_: Request, res: Response, next: NextFunction) {
        res.set('X-Powered-By', 'Notores');
        next();
    });
    apps.system.use(function notoresConfig(req: Request, _: Response, next: NextFunction) {
        req.notores = notores;
        req.config = getConfig();
        next();
    });

    apps.system.use(function notoresUseCookieCheck (req: Request, res: Response, next: NextFunction) {
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
                duration: req.config.cookie.duration || 20 * 7 * 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
                activeDuration: req.config.cookie.activeDuration || 20 * 7 * 24 * 60 * 60 * 1000, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
                cookie: {
                    httpOnly: req.config.cookie.httpOnly, // when true, cookie is not accessible from javascript
                }
            })(req, res, next);
        }

        return next();
    });

    apps.system.use(function notoresSessionIdCheck(req: Request, res: Response, next: NextFunction) {
        if (!req.config.cookie.useCookie) return next();

        if (req.session && !req.session.id) {
            req.session.id = crypto.randomBytes(16).toString('hex')
        }
        next();
    });

    apps.system.use(function notoresBodyParserJson(req: Request, res: Response, next: NextFunction){
        bodyParser.json({
            limit: req.config.server.requestSizeLimit
        })(req, res, next);
    });
    apps.system.use(function notoresBodyParserUrlEncoded(req: Request, res: Response, next: NextFunction){
        bodyParser.urlencoded({
            extended: true,
            limit: req.config.server.requestSizeLimit
        })(req, res, next);
    });

    apps.preMiddleware.use(function notoresInitLocals(req: Request, res: Response, next: NextFunction) {
        res.locals = new Locals(req, res);
        next();
    });

    apps.restricted.main.use(function notoresRestrictedCheckAuthenticated(req: Request, res: Response, next: NextFunction) {
        if (!req.config.authentication.enabled) {
            return next();
        }

        if (!req.isAuthenticated()) {
            res.locals.statusCode = 401;
            res.locals.error = new Error('Unauthenticated');
        } else if (req.user!.roles.length === 0) {
            res.locals.statusCode = 403;
            res.locals.error = new Error('Unauthorized');
        }

        return next();
    });

    return apps;
}

function buildApps() {
    apps = {
        main: express(),
        system: express.Router(),
        auth: express.Router(),
        preMiddleware: express.Router(),
        public: {
            router: express.Router(),
            preMiddleware: express.Router(),
            main: express.Router(),
            postMiddleware: express.Router(),
            responders: express.Router(),
        },
        restricted: {
            router: express.Router(),
            preMiddleware: express.Router(),
            main: express.Router(),
            postMiddleware: express.Router(),
            responders: express.Router(),
        },
        errorResponders: express.Router(),
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
    apps.public.responders.use(responseHandler)
    /** Restricted **/
    apps.main.use('/n-admin', apps.restricted.router);
    apps.restricted.router.use(apps.restricted.preMiddleware);
    apps.restricted.router.use(apps.restricted.main);
    apps.restricted.router.use(apps.restricted.postMiddleware);
    apps.restricted.router.use(apps.restricted.responders);
    apps.restricted.responders.use(responseHandler)
    /** Error Responder **/
    apps.main.use(apps.errorResponders);
    apps.errorResponders.use(errorResponseHandler);
}