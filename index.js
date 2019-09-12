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
exports.addConfigDefault = config_1.addConfigDefault;
exports.getConfig = config_1.getConfig;
exports.getConfigDefaults = config_1.getConfigDefaults;
exports.getDefaultConfig = config_1.getDefaultConfig;
exports.getPackage = config_1.getPackage;
exports.writeConfig = config_1.writeConfig;
const database = __importStar(require("./database"));
exports.database = database;
const ModuleHandler = __importStar(require("./ModuleHandler"));
exports.ModuleHandler = ModuleHandler;
const ModuleHandler_1 = require("./ModuleHandler");
exports.getModule = ModuleHandler_1.getModule;
exports.getModulesList = ModuleHandler_1.getModulesList;
exports.loadModule = ModuleHandler_1.loadModule;
exports.loadModules = ModuleHandler_1.loadModules;
const logger_1 = __importDefault(require("./logger"));
exports.logger = logger_1.default;
const responseHandler_1 = require("./lib/responseHandler");
exports.htmlResponder = responseHandler_1.htmlResponder;
exports.jsonResponder = responseHandler_1.jsonResponder;
exports.responseHandler = responseHandler_1.responseHandler;
const server_1 = require("./server");
exports.createServer = server_1.createServer;
exports.getServers = server_1.getServers;
exports.startServer = server_1.startServer;
const routeUtils_1 = require("./lib/routeUtils");
exports.addRouteToRegistry = routeUtils_1.addRouteToRegistry;
exports.checkEmptyParams = routeUtils_1.checkEmptyParams;
exports.checkInput = routeUtils_1.checkInput;
exports.checkParamIsObjectId = routeUtils_1.checkParamIsObjectId;
exports.getRegistry = routeUtils_1.getRegistry;
exports.handleActive = routeUtils_1.handleActive;
exports.middlewareForRouter = routeUtils_1.middlewareForRouter;
exports.routeWithHandle = routeUtils_1.routeWithHandle;
exports.updateHandleActive = routeUtils_1.updateHandleActive;
const helperFunctions_1 = require("./lib/helperFunctions");
exports.isIErrorObject = helperFunctions_1.isIErrorObject;
exports.isIModuleListing = helperFunctions_1.isIModuleListing;
const Locals = require('./lib/Locals').Locals;
exports.Locals = Locals;
const MongoSchema = require('./lib/MongoSchema');
exports.MongoSchema = MongoSchema;
const NotoresModule = require('./lib/NotoresModule');
exports.NotoresModule = NotoresModule;
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
