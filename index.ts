import {addConfigDefault, getConfig, getConfigDefaults, getDefaultConfig, getPackage, writeConfig} from "./lib/config";
import * as database from "./database";
import * as ModuleHandler from "./ModuleHandler";
import {getModule, getModulesList, loadModule, loadModules} from "./ModuleHandler";
import logger from './logger';
import {htmlResponder, jsonResponder, responseHandler} from "./lib/responseHandler";
import {createServer, getServers, startServer} from "./server";
import {
    addRouteToRegistry, checkEmptyParams, checkInput, checkParamIsObjectId, getRegistry,
    handleActive,
    middlewareForRouter,
    routeWithHandle,
    updateHandleActive
} from "./lib/routeUtils";
import {isIErrorObject, isIModuleListing} from "./lib/helperFunctions";

const Locals = require('./lib/Locals').Locals;
const MongoSchema = require('./lib/MongoSchema');
const NotoresModule = require('./lib/NotoresModule');

export default {
    getConfig,
    writeConfig,
    getPackage,
    addConfigDefault,
    getConfigDefaults,
    getDefaultConfig,
    database,
    ModuleHandler,
    getModule,
    loadModule,
    loadModules,
    getModulesList,
    logger,
    Locals,
    MongoSchema,
    NotoresModule,
    responseHandler,
    htmlResponder,
    jsonResponder,
    createServer,
    getServers,
    startServer,
    handleActive,
    updateHandleActive,
    routeWithHandle,
    middlewareForRouter,
    addRouteToRegistry,
    getRegistry,
    checkEmptyParams,
    checkParamIsObjectId,
    checkInput,
    isIErrorObject,
    isIModuleListing,
}

module.exports = {
    getConfig,
    writeConfig,
    getPackage,
    addConfigDefault,
    getConfigDefaults,
    getDefaultConfig,
    database,
    ModuleHandler,
    getModule,
    loadModule,
    loadModules,
    getModulesList,
    logger,
    Locals,
    MongoSchema,
    NotoresModule,
    responseHandler,
    htmlResponder,
    jsonResponder,
    createServer,
    getServers,
    startServer,
    handleActive,
    updateHandleActive,
    routeWithHandle,
    middlewareForRouter,
    addRouteToRegistry,
    getRegistry,
    checkEmptyParams,
    checkParamIsObjectId,
    checkInput,
    isIErrorObject,
    isIModuleListing,
};

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