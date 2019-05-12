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
    const cookieParser = require('cookie-parser');

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

    apps.main.use(passport.initialize());
    apps.main.use(passport.session());

    apps.main.use(bodyParser.json());
    apps.main.use(bodyParser.urlencoded({extended: true}));
    apps.main.use(cookieParser());
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
