"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./../../logger"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const index_1 = require("./../../index");
const user_1 = __importDefault(require("./models/user"));
const logger = logger_1.default(module);
const UserModel = user_1.default.model;
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    UserModel.getUserById(id)
        .then((user) => {
        done(null, user);
    })
        .catch((err) => {
        done(err, undefined);
    });
});
const config = index_1.getConfig();
const localOpts = {
    usernameField: 'email',
    passwordField: 'password',
    ...config.main.authentication
};
const jwtOpts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    ...config.main.jwt,
};
passport_1.default.use(new passport_local_1.Strategy(localOpts, (email, password, done) => {
    UserModel.authenticate(email, password)
        .then((user) => {
        return done(null, user);
    })
        .catch((error) => {
        logger.error(`LocalStrategy error: ${error}`);
        return done(error, undefined);
    });
}));
passport_1.default.use(new passport_jwt_1.Strategy(jwtOpts, function (jwt_payload, done) {
    UserModel.getUserById(jwt_payload.id)
        .then((user) => {
        return done(null, user);
    })
        .catch((error) => {
        logger.error(`JwtStrategy error: ${error}`);
        return done(error, false);
    });
}));
const authenticate = function authenticate(strategy) {
    return (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        passport_1.default.authenticate(strategy, (err, user, info) => {
            if (user.error) {
                res.locals.setBody({ error: user.error });
                return next('route');
            }
            else if (!user) {
                res.locals.setBody({ error: 'Something went wrong, please try again later.' });
                return next('route');
            }
            else {
                return req.login(user, () => {
                    next();
                });
            }
        })(req, res, next);
    };
};
module.exports = {
    authenticate,
};
