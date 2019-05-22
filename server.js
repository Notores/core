const logger = require('./logger')(module);

const apps = {
    main: null,
    preMiddleware: null,
    public: {
        preMiddleware: null,
        router: null,
        postMiddleware: null,
    },
    private: {
        preMiddleware: null,
        router: null,
        postMiddleware: null,
    },
};

function createServer() {
    const express = require('express');
    const passport = require('passport');
    const compression = require('compression');
    const bodyParser = require('body-parser');
    // const cookieParser = require('cookie-parser');
    const sessions = require('client-sessions');
    const crypto = require('crypto');

    const {getConfig} = require('./lib/config');
    const locals = require('./lib/Locals');
    const responseHandler = require('./lib/responseHandler');
    const {checkAcceptsHeaders} = require('./lib/routeUtils');

    apps.main = express();
    apps.preMiddleware = express();
    apps.public.main = express();
    apps.public.preMiddleware = express();
    apps.public.router = express();
    apps.public.postMiddleware = express();
    apps.private.main = express();
    apps.private.preMiddleware = express();
    apps.private.router = express();
    apps.private.postMiddleware = express();

    apps.main.use(compression());

    apps.main.use((req, res, next) => {
        res.header('X-Powered-By', 'Notores');
        next();
    });

    apps.main.use((req, res, next) => {
        req.notores = getConfig();
        next();
    });

    apps.main.use(sessions({
        cookieName: 'notores', // cookie name dictates the key name added to the request object
        requestKey: 'session', // changes the session key from req.cookieName to this (req.session)
        secret: process.env.COOKIE_SECRET, // should be a large unguessable string
        duration: 20 * 7 * 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
        activeDuration: 20 * 7 * 24 * 60 * 60 * 1000, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
        cookie: {
            httpOnly: true, // when true, cookie is not accessible from javascript
        }
    }));

    apps.main.use((req, res, next) => {
        if (!req.session.id) {
            const buf = crypto.randomBytes(16);
            req.session.id = buf.toString('hex');
            // console.log(req.wsSession);
        }
        next();
    });

    apps.main.use(bodyParser.json());
    apps.main.use(bodyParser.urlencoded({extended: true}));

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
        if (req.user.roles.length === 0) {
            return res.redirect('/profile');
        }
        return next();
    });

    apps.private.main.use(apps.private.preMiddleware);
    apps.private.main.use(apps.private.router);
    apps.private.main.use(apps.private.postMiddleware);

    apps.main.use(
        checkAcceptsHeaders(['html', 'json']),
        responseHandler.responseHandler
    );

    return apps;
}

function startServer(port = process.env.PORT) {
    if (!port)
        port = 3000;

    if (!apps.main)
        createServer();

    apps.main.listen(port, () => {
        logger.info(`Server started, listening on port:${port}`);
        if (process.env.NODE_ENV === 'development')
            logger.info(`Server can be reached on http://localhost:${port}`);
    })
}

function getServers() {
    return apps;
}

module.exports = {
    createServer,
    startServer,
    getServers,
};
