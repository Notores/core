const {writeFileSync, unlinkSync} = require('fs');
const {join} = require('path');
const mongoose = require('mongoose');
const notoresJson = require('./notores.test.json');

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
        const whiteLists = require('./userWhiteLists');
        const testUsers = require('./user.test.json');
        const userPassword = 'I love you 3000!';

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
                let user;

                beforeEach(done => {
                    user = new userSchema.model(testUsers[0]);
                    user.save().then(() => done());
                });

                afterEach(done => {
                    userSchema.model.deleteMany().then(() => done());
                });

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
    });
});
