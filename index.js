"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./lib/config");
const database = __importStar(require("./database"));
const ModuleHandler = __importStar(require("./ModuleHandler"));
const ModuleHandler_1 = require("./ModuleHandler");
const logger_1 = __importDefault(require("./logger"));
const responseHandler_1 = require("./lib/responseHandler");
const server_1 = require("./server");
const routeUtils_1 = require("./lib/routeUtils");
const helperFunctions_1 = require("./lib/helperFunctions");
const Locals = require('./lib/Locals').Locals;
const MongoSchema = require('./lib/MongoSchema');
const NotoresModule = require('./lib/NotoresModule');
exports.default = {
    getConfig: config_1.getConfig,
    writeConfig: config_1.writeConfig,
    getPackage: config_1.getPackage,
    addConfigDefault: config_1.addConfigDefault,
    getConfigDefaults: config_1.getConfigDefaults,
    getDefaultConfig: config_1.getDefaultConfig,
    database,
    ModuleHandler,
    getModule: ModuleHandler_1.getModule,
    loadModule: ModuleHandler_1.loadModule,
    loadModules: ModuleHandler_1.loadModules,
    getModulesList: ModuleHandler_1.getModulesList,
    logger: logger_1.default,
    Locals,
    MongoSchema,
    NotoresModule,
    responseHandler: responseHandler_1.responseHandler,
    htmlResponder: responseHandler_1.htmlResponder,
    jsonResponder: responseHandler_1.jsonResponder,
    createServer: server_1.createServer,
    getServers: server_1.getServers,
    startServer: server_1.startServer,
    handleActive: routeUtils_1.handleActive,
    updateHandleActive: routeUtils_1.updateHandleActive,
    routeWithHandle: routeUtils_1.routeWithHandle,
    middlewareForRouter: routeUtils_1.middlewareForRouter,
    addRouteToRegistry: routeUtils_1.addRouteToRegistry,
    getRegistry: routeUtils_1.getRegistry,
    checkEmptyParams: routeUtils_1.checkEmptyParams,
    checkParamIsObjectId: routeUtils_1.checkParamIsObjectId,
    checkInput: routeUtils_1.checkInput,
    isIErrorObject: helperFunctions_1.isIErrorObject,
    isIModuleListing: helperFunctions_1.isIModuleListing,
};
module.exports = {
    getConfig: config_1.getConfig,
    writeConfig: config_1.writeConfig,
    getPackage: config_1.getPackage,
    addConfigDefault: config_1.addConfigDefault,
    getConfigDefaults: config_1.getConfigDefaults,
    getDefaultConfig: config_1.getDefaultConfig,
    database,
    ModuleHandler,
    getModule: ModuleHandler_1.getModule,
    loadModule: ModuleHandler_1.loadModule,
    loadModules: ModuleHandler_1.loadModules,
    getModulesList: ModuleHandler_1.getModulesList,
    logger: logger_1.default,
    Locals,
    MongoSchema,
    NotoresModule,
    responseHandler: responseHandler_1.responseHandler,
    htmlResponder: responseHandler_1.htmlResponder,
    jsonResponder: responseHandler_1.jsonResponder,
    createServer: server_1.createServer,
    getServers: server_1.getServers,
    startServer: server_1.startServer,
    handleActive: routeUtils_1.handleActive,
    updateHandleActive: routeUtils_1.updateHandleActive,
    routeWithHandle: routeUtils_1.routeWithHandle,
    middlewareForRouter: routeUtils_1.middlewareForRouter,
    addRouteToRegistry: routeUtils_1.addRouteToRegistry,
    getRegistry: routeUtils_1.getRegistry,
    checkEmptyParams: routeUtils_1.checkEmptyParams,
    checkParamIsObjectId: routeUtils_1.checkParamIsObjectId,
    checkInput: routeUtils_1.checkInput,
    isIErrorObject: helperFunctions_1.isIErrorObject,
    isIModuleListing: helperFunctions_1.isIModuleListing,
};
config_1.addConfigDefault({
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
