const {getConfig, writeConfig, getPackage} = require('./lib/config');
const database = require('./database');
const ModuleHandler = require('./ModuleHandler');
const logger = require('./logger');
const Locals = require('./lib/Locals').Locals;
const {serveStatic} = require('./lib/middleware');
const MongoSchema = require('./lib/MongoSchema');
const NotoresModule = require('./lib/NotoresModule');
const {responseHandler, htmlResponder, jsonResponder} = require('./lib/responseHandler');
const {createServer, getServers, startServer} = require('./server');
const { routeWithHandle, middlewareForRouter, addRouteToRegistry, getRegistry, handleActive, checkEmptyParams, checkParamIsObjectId, checkInput } = require('./lib/routeUtils');

module.exports = {
    checkEmptyParams,
    checkParamIsObjectId,
    checkInput,
    database,
    getConfig,
    writeConfig,
    getPackage,
    getModule: ModuleHandler.getModule,
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
