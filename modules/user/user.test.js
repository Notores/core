const {writeFileSync, unlinkSync} = require('fs');
const {join} = require('path');
const mongoose = require('mongoose');
const {Locals} = require('./../../lib/Locals');
const jwt = require('jsonwebtoken');

const root = process.cwd();

function writeNotoresConfig(dataString) {
    writeFileSync(join(root, 'notores.json'), dataString);
}

function unlinkNotoresConfig() {
    unlinkSync(join(root, 'notores.json'));
}

describe('Notores/Modules/User', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Tests', () => {

        const userSchema = require('./models/user');
        const Router = require('./Router');
        const whiteLists = require('./userWhiteLists');
        const testUsers = require('./user.test.json');
        const userPassword = 'I love you 3000!';
        const notoresTestJson = require('./notores.test.json');
        let user;

        beforeEach(done => {
            user = new userSchema.model(testUsers[0]);
            user.save().then(() => done());
        });

        afterEach(done => {
            userSchema.model.deleteMany().then(() => done());
        });

        describe('Model', () => {
            describe('Whitelist', () => {
                it('Should have whitelist "get"', () => {
                    expect(userSchema.whitelist.hasOwnProperty('get')).toBeTruthy();
                });

                it('Should have a list of properties for "get"', () => {
                    expect(userSchema.whitelist.get).toEqual(whiteLists.get);
                });

                it('Should have whitelist "session"', () => {
                    expect(userSchema.whitelist.hasOwnProperty('get')).toBeTruthy();
                });

                it('Should have a list of properties for "session"', () => {
                    expect(userSchema.whitelist.session).toEqual(whiteLists.session);
                });
            });

            describe('statics', () => {

                describe('encryptString', () => {
                    it('Should not be the same as the input string', async () => {
                        const result = await userSchema.model.encryptString(userPassword);

                        expect(result).not.toEqual(userPassword);
                    });
                });

                describe('authenticate', () => {
                    it('Should return an error if no users are found', async () => {
                        const result = await userSchema.model.authenticate('FakeUserEmail', 'FakeUserPassword');

                        expect(result).toHaveProperty('error');
                        expect(result).not.toHaveProperty('email');
                    });

                    it('Should return an error if the password is incorrect', async () => {
                        const result = await userSchema.model.authenticate(user.email, 'FakeUserPassword');

                        expect(result).toHaveProperty('error');
                        expect(result).not.toHaveProperty('email');
                    });

                    it('Should return the user if the credentials are correct', async () => {
                        const result = await userSchema.model.authenticate(user.email, userPassword);

                        expect(result).toHaveProperty('email', user.email);
                        expect(result).not.toHaveProperty('error');
                        expect(result.hasOwnProperty('password')).toBeFalsy();
                    });

                });

                describe('register', () => {
                    it('Should return an error if the user already exists', async () => {
                        const result = await userSchema.model.register(user);

                        expect(result).toHaveProperty('error', 'User already exists');
                    });

                    it('Should register a new user based on the input', async () => {
                        const input = {
                            email: 'a-very-normal@email.com',
                            password: 'They will never guess this!!',
                        };

                        const result = await userSchema.model.register(input);

                        const count = await userSchema.model.find({_id: result.id}).select('id').exec();

                        expect(result).toHaveProperty('id');
                        expect(count.length).toEqual(1);
                    });
                });
            });

            describe('methods', () => {
                describe('updatePassword', () => {
                    it('Should return an error if the old password is incorrect', () => {

                    });
                });
            });
        });

        describe('routes', () => {
            let spyRouter;

            beforeEach(() => spyRouter = {
                get: jest.fn(),
                post: jest.fn(),
                patch: jest.fn(),
                delete: jest.fn(),
            });

        });

        describe('Router', () => {
            let req;
            let res;
            let next;

            Locals.addResponseType('html');

            beforeEach(() => {
                req = {
                    isAuthenticated: jest.fn(() => true),
                    params: {},
                    body: {},
                    notores: {
                        ...notoresTestJson
                    },
                    session: {},
                    user,
                    logout: jest.fn(),
                };
                res = {
                    status: jest.fn(),
                    redirect: jest.fn(),
                };
                next = jest.fn();
                res.locals = new Locals(req);
            });

            describe('.getModel', () => {
                it('Should return the UserSchema instance', () => {
                    expect(Router.getModel()).toHaveProperty('modelName', userSchema.modelName);
                });
            });

            describe('.getModelWrapper', () => {
                it('Should return the UserModel instance', () => {
                    expect(Router.getModelWrapper()).toEqual(userSchema);
                });
            });

            describe('.login', () => {
                it('Should set the current loggedin user to locals', () => {
                    Router.login(req, res, next);

                    expect(res.locals.body).toHaveProperty('user', user);
                    expect(next).toHaveBeenCalledTimes(1);
                });

                it('Should set the users id and jwt in the session', () => {
                    Router.login(req, res, next);

                    expect(req.session).toHaveProperty('id', user.id);
                    expect(req.session).toHaveProperty('jwt', res.locals.body.jwt);
                    expect(next).toHaveBeenCalledTimes(1);
                });

                it('Should set the current loggedin users id in jwt to locals', () => {
                    Router.login(req, res, next);

                    const result = jwt.decode(res.locals.body.jwt, notoresTestJson.main.jwt);

                    expect(result).toHaveProperty('id', user.id);
                    expect(next).toHaveBeenCalledTimes(1);
                });
            });

            describe('.logout', () => {
                it('Should call req.logout to destroy the users session', () => {
                    Router.logout(req, res, next);

                    expect(req.logout).toHaveBeenCalledTimes(1);
                    expect(next).toHaveBeenCalledTimes(1);
                });

                it('Should set a message to locals if the type = "json"', () => {
                    Router.logout(req, res, next);

                    expect(res.redirect).toHaveBeenCalledTimes(0);
                    expect(res.locals.body).toHaveProperty('message');
                    expect(next).toHaveBeenCalledTimes(1);
                });

                it('Should redirect to "/" (home) if the type = "html"', () => {
                    res.locals.type = 'html';

                    Router.logout(req, res, next);

                    expect(res.redirect).toHaveBeenCalledTimes(1);
                    expect(res.redirect).toHaveBeenCalledWith('/');
                    expect(next).toHaveBeenCalledTimes(0);
                });
            });

        });
    });
});
