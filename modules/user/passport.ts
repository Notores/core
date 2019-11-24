import logger0 from "./../../logger";
import passport, {Strategy} from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import {ExtractJwt, Strategy as JwtStrategy} from "passport-jwt";
import {getConfig} from "./../../index";
import User, {IUser} from "./models/user";
import {NextFunction, Response} from "express";

const logger = logger0(module);
const UserModel = User.model;

passport.serializeUser(function (user : IUser, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    UserModel.getUserById(id)
        .then((user : IUser) => {
            done(null, user);
        })
        .catch((err : Error) => {
            done(err, undefined);
        });
});

const config = getConfig();

const localOpts = {
    usernameField: 'email',
    passwordField: 'password',
    ...config.main.authentication
};

const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ...config.main.jwt,
};

passport.use(new LocalStrategy(localOpts, (email, password, done) => {
    UserModel.authenticate(email, password)
        .then((user : IUser) => {
            return done(null, user);
        })
        .catch((error : Error) => {
            logger.error(`LocalStrategy error: ${error}`);
            return done(error, undefined);
        });
}));

passport.use(new JwtStrategy(jwtOpts, function (jwt_payload, done) {
    UserModel.getUserById(jwt_payload.id)
        .then((user : IUser) => {
            return done(null, user);
        })
        .catch((error: Error) => {
            logger.error(`JwtStrategy error: ${error}`);
            return done(error, false);
        });
}));

const authenticate = function authenticate(strategy : string) {
    return (req: Notores.IAuthenticatedRequest, res : Response, next: NextFunction) => {
        if (req.isAuthenticated())
            return next();

        passport.authenticate(strategy, (err : any, user : IUser & {error: any}, info : any) => {
            if (user.error) {
                res.locals.setBody({error: user.error});
                return next('route');
            } else if (!user) {
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
