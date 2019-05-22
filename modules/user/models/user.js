const {MongoSchema, getConfig} = require('@notores/core');
const logger = require('@notores/core/logger')(module);
const bcrypt = require('bcrypt');
const defaultSaltRounds = 10;

const User = new MongoSchema('User', {
        // username: {type: String, required: false, unique: false},
        email: {type: String, required: true, unique: true, index: true},
        password: {type: String, required: false},
        firstname: {type: String, required: false},
        lastname: {type: String, required: false},
        roles: [{type: String}],
    }, {
        minimize: false,
        timestamps: {createdOn: 'createdOn', updatedOn: 'updatedOn'}
    }
);

const whiteLists = require('./../userWhiteLists.json');
for (let key in whiteLists) {
    User.updateWhitelist(key, whiteLists[key]);
}

User.statics.getUsernameField = function () {
    const mainConfig = getConfig('main');
    let authenticationConfig = mainConfig.authentication;

    if (!authenticationConfig)
        authenticationConfig = {
            usernameField: 'email'
        };

    return authenticationConfig.usernameField;
};

User.statics.encryptString = async function (str) {
    const mainConfig = getConfig('main');
    const saltRounds = mainConfig.hasOwnProperty('error') ? defaultSaltRounds : mainConfig.authentication.saltRounds
    return await bcrypt.hash(str, saltRounds);
};

User.statics.authenticate = async function (email = '', password = '') {
    const usernameField = User.model.getUsernameField();

    const findOneQuery = {
        [usernameField]: {$regex: new RegExp(`^${email}$`, 'i')},
    };

    const result = await User.model.findOne(findOneQuery).select('_id username email password').exec();

    if (!result)
        return {error: 'Wrong username or password'};

    const compareResult = await bcrypt.compare(password, result.password);

    if (!compareResult)
        return {error: 'Wrong username or password'};

    return await User.model.getUserById(result.id);
};

User.statics.register = async function (input) {
    const usernameField = User.model.getUsernameField();
    const checkExists = await User.model.findUserByUsernameField(input[usernameField]);

    if (checkExists)
        return {error: 'User already exists'};

    const user = new User.model({[usernameField]: input[usernameField], password: input.password});

    await user.save();

    return await User.model.getUserById(user.id);
};

User.statics.findUserByUsernameField = async function (email) {
    const usernameField = User.model.getUsernameField();

    return await User.model.findOne({[usernameField]: email}).select(User.whitelist.session).exec();
};

User.statics.getUserById = async (id) => {
    return await User.model.findOne({_id: id}).select(User.whitelist.session).exec();
};

User.methods.verifyPassword = async function (pass) {
    console.log(pass, this.password);
    const isCorrectPassword = await bcrypt.compare(pass, this.password);
    return isCorrectPassword ? {message: 'Correct password'} : {error: 'Incorrect password'};
};

User.methods.updatePassword = async function (oldPass, newPass) {
    const compareResult = await this.verifyPassword(oldPass);
    if (compareResult.error)
        return compareResult;

    this.password = await User.model.encryptString(newPass);

    try {
        await this.save();
    } catch (e) {
        logger.error(`Something went wrong updating the password for user ${this._id}: ${e.message}`);
        return {error: `Something went wrong, please try again`};
    }

    return {message: 'Success'};
};

User.loadModel();

module.exports = User;
