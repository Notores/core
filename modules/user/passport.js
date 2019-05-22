const logger = require('@notores/core/logger')(module);
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const {getConfig} = require('@notores/core');

const User = require('./models/user');
const UserModel = User.model;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    UserModel.getUserById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});

const mainConfig = getConfig('main');

const localOpts = {
    usernameField: 'email',
    passwordField: 'password',
    ...mainConfig.authentication
};

const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ...mainConfig.jwt,
};

passport.use(new LocalStrategy(localOpts, (email, password, done) => {
    UserModel.authenticate(email, password)
        .then(user => {
            return done(null, user);
        })
        .catch(error => {
            logger.error(`LocalStrategy error: ${error}`);
            return done(error, false);
        });
}));

passport.use(new JwtStrategy(jwtOpts, function (jwt_payload, done) {
    UserModel.getUserById(jwt_payload.id)
        .then(user => {
            return done(null, user);
        })
        .catch(error => {
            logger.error(`JwtStrategy error: ${error}`);
            return done(error, false);
        });
}));

const authenticate = function authenticate(strategy) {
    return (req, res, next) => {
        if (req.isAuthenticated())
            return next();

        passport.authenticate(strategy, (err, user, info) => {
            if (user.error) {
                res.locals.setBody({error: user.error});
                return next('route');
            } else if (user === false) {
                res.locals.setBody({error: 'Something went wrong, please try again later.'});
                return next('route');
            } else {
                return req.login(user, () => {
                    next();
                });
            }
        })(req, res, next);
    }
};

module.exports = {
    authenticate,
};