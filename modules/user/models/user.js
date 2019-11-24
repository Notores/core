"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoSchema_1 = __importDefault(require("../../../lib/MongoSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("./../../../logger");
const index_1 = require("./../../../index");
const whiteLists = require("./../userWhiteLists.json");
const logger = logger_1.initLogger(module);
const defaultSaltRounds = 10;
const User = new MongoSchema_1.default('User', {
    // username: {type: String, required: false, unique: false},
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    roles: [{ type: String }],
}, {
    minimize: false,
    timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }
});
for (let key in whiteLists) {
    User.updateWhitelist(key, whiteLists[key]);
}
User.statics.getUsernameField = function () {
    const config = index_1.getConfig();
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
User.statics.encryptString = async function (str) {
    const config = index_1.getConfig();
    const saltRounds = config.hasOwnProperty('error') ? defaultSaltRounds : config.main.authentication.saltRounds;
    return await bcrypt_1.default.hash(str, saltRounds);
};
User.statics.authenticate = async function (email = '', password = '') {
    if (!User.model)
        return;
    // @ts-ignore
    const usernameField = User.model.getUsernameField();
    const findOneQuery = {
        [usernameField]: { $regex: new RegExp(`^${email}$`, 'i') },
    };
    const result = await User.model.findOne(findOneQuery).select('_id username email password').exec();
    if (!result)
        return { error: 'Wrong username or password' };
    const compareResult = await bcrypt_1.default.compare(password, result.password);
    if (!compareResult)
        return { error: 'Wrong username or password' };
    // @ts-ignore
    return await User.model.getUserById(result.id);
};
User.statics.register = async function (input) {
    if (!User.model)
        return;
    const usernameField = User.model.getUsernameField();
    const checkExists = await User.model.findUserByUsernameField(input[usernameField]);
    if (checkExists)
        return { error: 'User already exists' };
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
User.statics.findUserByUsernameField = async function (email) {
    const usernameField = User.model.getUsernameField();
    return await User.model.findOne({ [usernameField]: email }).select(User.whitelist.session).exec();
};
User.statics.getUserById = async (id) => {
    return await User.model.findOne({ _id: id }).select(User.whitelist.session).exec();
};
User.methods.verifyPassword = async function (pass) {
    const isCorrectPassword = await bcrypt_1.default.compare(pass, this.password);
    return isCorrectPassword ? { message: 'Correct password' } : { error: 'Incorrect password' };
};
User.methods.updatePassword = async function (oldPass, newPass) {
    const compareResult = await this.verifyPassword(oldPass);
    if (compareResult.error)
        return compareResult;
    this.password = await User.model.encryptString(newPass);
    try {
        await this.save();
    }
    catch (e) {
        logger.error(`Something went wrong updating the password for user ${this._id}: ${e.message}`);
        return { error: `Something went wrong, please try again` };
    }
    return { message: 'Success' };
};
User.loadModel();
exports.default = User;
module.exports = User;
