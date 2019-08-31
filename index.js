"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
_a = require('./lib/config'), exports.getConfig = _a.getConfig, exports.writeConfig = _a.writeConfig, exports.getPackage = _a.getPackage, exports.addConfigDefault = _a.addConfigDefault, exports.getConfigDefaults = _a.getConfigDefaults, exports.getDefaultConfig = _a.getDefaultConfig;
exports.database = require('./database');
exports.ModuleHandler = require('./ModuleHandler');
_b = require('./ModuleHandler'), exports.getModule = _b.getModule, exports.loadModule = _b.loadModule, exports.loadModules = _b.loadModules, exports.getModulesList = _b.getModulesList;
exports.logger = require('./logger');
exports.Locals = require('./lib/Locals').Locals;
exports.MongoSchema = require('./lib/MongoSchema');
exports.NotoresModule = require('./lib/NotoresModule');
_c = require('./lib/responseHandler'), exports.responseHandler = _c.responseHandler, exports.htmlResponder = _c.htmlResponder, exports.jsonResponder = _c.jsonResponder;
_d = require('./server'), exports.createServer = _d.createServer, exports.getServers = _d.getServers, exports.startServer = _d.startServer;
_e = require('./lib/routeUtils'), exports.handleActive = _e.handleActive, exports.updateHandleActive = _e.updateHandleActive, exports.routeWithHandle = _e.routeWithHandle, exports.middlewareForRouter = _e.middlewareForRouter, exports.addRouteToRegistry = _e.addRouteToRegistry, exports.getRegistry = _e.getRegistry, exports.checkEmptyParams = _e.checkEmptyParams, exports.checkParamIsObjectId = _e.checkParamIsObjectId, exports.checkInput = _e.checkInput;
_f = require('./lib/helperFunctions'), exports.isIErrorObject = _f.isIErrorObject, exports.isIModuleListing = _f.isIModuleListing;
exports.addConfigDefault({
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
