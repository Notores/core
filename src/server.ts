import express, {Request, Response, NextFunction} from 'express';
import {IServer} from "./interfaces/IServer";
import './namespace/Notores';
import {loggerFactory} from "./lib/logger";
import Responder from "./lib/Responder";

const logger = loggerFactory(module);

const apps: IServer = {
    main: express(),
    system: express(),
    preMiddleware: express(),
    public: {
        main: express(),
        preMiddleware: express(),
        router: express(),
        postMiddleware: express(),
    },
    private: {
        main: express(),
        preMiddleware: express(),
        router: express(),
        postMiddleware: express(),
    },
};

export function createServer(): IServer {
    const passport = require('passport');
    const compression = require('compression');
    const bodyParser = require('body-parser');
    const sessions = require('client-sessions');
    const crypto = require('crypto');

    const {getConfig} = require('./lib/config');
    const locals = require('./lib/Locals');

    const config = getConfig();
    const mainConfig = config.main || {};
    const serverConfig = mainConfig.server || {requestSizeLimit: '1mb'};

    apps.main.use(compression());

    apps.main.use((req: Request, res: Response, next: NextFunction) => {
        res.header('X-Powered-By', 'Notores');
        next();
    });

    apps.main.use(apps.system);

    apps.system.use((req: Request, res: Response, next: NextFunction) => {
        req.notores = getConfig();
        next();
    });

    apps.system.use((req: Request, res: Response, next: NextFunction) => {
        if (req.notores.main.useCookie) {
            const secret = process.env.COOKIE_SECRET || req.notores.main.cookieSecret || 'NO_SECRET_SET_DO_SET_A_SECRET!';
            if (secret === 'NO_SECRET_SET_DO_SET_A_SECRET!' && process.env.NODE_ENV !== 'production') {
                logger.error(`NO COOKIE SECRET FOUND IN ENVIRONMENT OR IN NOTORES CONFIG FILE!`);
            }
            return sessions({
                cookieName: 'notores', // cookie name dictates the key name added to the request object
                requestKey: 'session', // changes the session key from req.cookieName to this (req.session)
                secret: process.env.COOKIE_SECRET || 'BASE KEY', // should be a large unguessable string
                duration: 20 * 7 * 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
                activeDuration: 20 * 7 * 24 * 60 * 60 * 1000, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
                cookie: {
                    httpOnly: true, // when true, cookie is not accessible from javascript
                }
            })(req, res, next);
        }
        return next();
    });

    apps.system.use((req: Request, res: Response, next: NextFunction) => {
        if (!req.notores.main.useCookie)
            return next();

        if (req.session && !req.session.id) {
            const buf = crypto.randomBytes(16);
            req.session.id = buf.toString('hex');
            // console.log(req.wsSession);
        }
        next();
    });

    apps.system.use(Responder.serverStatic);

    apps.system.use(bodyParser.json({limit: serverConfig.requestSizeLimit}));
    apps.system.use(bodyParser.urlencoded({extended: true, limit: serverConfig.requestSizeLimit}));

    if (mainConfig.authentication.enabled) {
        apps.system.use(passport.initialize());
        apps.system.use(passport.session());

        apps.system.use((req: Request, res: Response, next: NextFunction) => {
            if (req.isAuthenticated())
                return next();

            passport.authenticate('jwt', (err: Error, user: Notores.user, info: any) => {
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

    apps.main.use('/n-admin', apps.private.main);

    if (mainConfig.authentication.enabled) {
        apps.private.main.use((req: Request, res: Response, next: NextFunction) => {
            if (!req.isAuthenticated()) {
                if (res.locals.type === 'html') {
                    // console.log('redirecting to login...');
                    return res.redirect('/login');
                } else {
                    res.locals.error = {status: 401, message: 'Unauthenticated'};
                }
            } else {
                if (req.user!.roles.length === 0) {
                    if (res.locals.type === 'html') {
                        return res.redirect('/profile');
                    } else {
                        res.locals.error = {status: 403, message: 'Unauthorized'};
                    }
                }
            }
            return next();
        });
    }
    apps.private.main.use((req: Request, res: Response, next: NextFunction) => {
        if (res.locals.hasError) {
            return Responder.jsonResponder(req, res, next);
        }
        return next();
    });

    apps.private.main.use(Responder.serverStatic);


    apps.private.main.use(apps.private.preMiddleware);
    apps.private.main.use(apps.private.router);
    apps.private.main.use(apps.private.postMiddleware);

    apps.private.main.use(
        Responder.responseHandler
    );

    apps.main.use(
        Responder.responseHandler
    );

    return apps;
}

export function getServers(): IServer {
    return apps;
}
