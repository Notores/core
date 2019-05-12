const {getConfig, writeConfig, getPackage} = require('./lib/config');
const database = require('./database');
const ModuleHandler = require('./ModuleHandler');
// const {getModule, loadModules} = require('./lib/modules');
const logger = require('./logger');
const Locals = require('./lib/Locals').Locals;
const {serveStatic} = require('./lib/middleware');
const MongoSchema = require('./lib/MongoSchema');
const NotoresModule = require('./lib/NotoresModule');
const {responseHandler, htmlResponder, jsonResponder} = require('./lib/responseHandler');
const {routeWithHandle, middlewareForRouter, addRouteToRegistry, getRegistry, handleActive, getThemePath, checkEmptyParams, checkParamIsObjectId} = require('./lib/routeUtils');
const {createServer, getServers, startServer} = require('./server');

module.exports = {
    checkEmptyParams,
    checkParamIsObjectId,
    database,
    getConfig,
    writeConfig,
    getPackage,
    getModule: ModuleHandler.getModule,
    getThemePath,
    Locals,
    logger,
    MongoSchema,
    NotoresModule,
    responseHandler,
    htmlResponder,
    jsonResponder,
    routeWithHandle,
    middlewareForRouter,
    addRouteToRegistry,
    getRegistry,
    handleActive,
    createServer,
    getServers,
    serveStatic,
    startServer,
};
