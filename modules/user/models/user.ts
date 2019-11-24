import MongoSchema from "../../../lib/MongoSchema";
import {Document} from "mongoose";
import bcrypt from "bcrypt";
import {initLogger} from "./../../../logger";
import {getConfig} from "./../../../index";
import {StringKeyObject} from "../../../Types";

const whiteLists = require("./../userWhiteLists.json");
const logger = initLogger(module);
const defaultSaltRounds = 10;

export interface IUser extends Document{
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    roles: Array<string>
}

const User = new MongoSchema<IUser>('User',
    {
        // username: {type: String, required: false, unique: false},
        email: {type: String, required: true, unique: true, index: true},
        password: {type: String, required: false},
        firstname: {type: String, required: false},
        lastname: {type: String, required: false},
        roles: [{type: String}],
    }, {
        minimize: false,
        timestamps: {createdAt: 'createdOn', updatedAt: 'updatedOn'}
    }
);
for (let key in whiteLists) {
    User.updateWhitelist(key, whiteLists[key]);
}

User.statics.getUsernameField = function () {
    const config = getConfig();
    let authenticationConfig = config.main.authentication;

    if (!authenticationConfig)
        authenticationConfig = {
            usernameField: 'email',
            saltRounds: defaultSaltRounds
        };

    return authenticationConfig.usernameField;
};

/**
 * Encrypts a string like a password  using bcrypt
 * @param {String} str The string to encrypt
 * @return {Promise<String>} Promise with an encrytped string on resolve
 */
User.statics.encryptString = async function (str : string) {
    const config = getConfig();
    const saltRounds = config.hasOwnProperty('error') ? defaultSaltRounds : config.main.authentication.saltRounds
    return await bcrypt.hash(str, saltRounds);
};

User.statics.authenticate = async function (email : string = '', password : string = '') {
    if(!User.model)
        return;
    // @ts-ignore
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

    // @ts-ignore
    return await User.model.getUserById(result.id);
};

User.statics.register = async function (input : StringKeyObject) {
    if(!User.model)
        return;

    const usernameField = User.model.getUsernameField();
    const checkExists = await User.model.findUserByUsernameField(input[usernameField]);

    if (checkExists)
        return {error: 'User already exists'};

    const password = await User.model.encryptString(input.password);

    const userToSaveObject = {
        ...input,
        [usernameField]: input[usernameField],
        password
    };

    // @ts-ignore
    delete userToSaveObject.repeatPassword;

    const user = new User.model(userToSaveObject);

    await user.save();

    return await User.model.getUserById(user.id);
};


User.statics.findUserByUsernameField = async function (email : string) {
    const usernameField = User.model.getUsernameField();

    return await User.model.findOne({[usernameField]: email}).select(User.whitelist.session).exec();
};

User.statics.getUserById = async (id : string) => {
    return await User.model.findOne({_id: id}).select(User.whitelist.session).exec();
};

User.methods.verifyPassword = async function (pass : string) {
    const isCorrectPassword = await bcrypt.compare(pass, this.password);
    return isCorrectPassword ? {message: 'Correct password'} : {error: 'Incorrect password'};
};

User.methods.updatePassword = async function (oldPass : string, newPass : string) {
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
export default User;
module.exports = User;
