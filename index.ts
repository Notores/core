export const {getConfig, writeConfig, getPackage, addConfigDefault, getConfigDefaults, getDefaultConfig} = require('./lib/config');
export const database = require('./database');
export const ModuleHandler = require('./ModuleHandler');
export const {getModule, loadModule, loadModules, getModulesList} = require('./ModuleHandler');
export const logger = require('./logger');
export const Locals = require('./lib/Locals').Locals;
export const MongoSchema = require('./lib/MongoSchema');
export const NotoresModule = require('./lib/NotoresModule');
export const {responseHandler, htmlResponder, jsonResponder} = require('./lib/responseHandler');
export const {createServer, getServers, startServer} = require('./server');
export const {handleActive, updateHandleActive, routeWithHandle, middlewareForRouter, addRouteToRegistry, getRegistry, checkEmptyParams, checkParamIsObjectId, checkInput} = require('./lib/routeUtils');
export const {isIErrorObject, isIModuleListing} = require('./lib/helperFunctions');

addConfigDefault({
    key: 'main',
    value: {
        authentication: {
            usernameField: 'email',
            saltRounds: 10,
        },
        jwt: {
            secretOrKey: 'ADD_A_SECRET',
            issuer: 'ADD_ISSUER',
            audience: 'ADD_AUDIENCE',
        }
    }
});