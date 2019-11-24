import { addConfigDefault, getConfig, getConfigDefaults, getDefaultConfig, getPackage, writeConfig } from "./lib/config";
import * as database from "./database";
import * as ModuleHandler from "./ModuleHandler";
import { getModule, getModulesList, loadModule, loadModules } from "./ModuleHandler";
import logger from './logger';
import { htmlResponder, jsonResponder, responseHandler } from "./lib/responseHandler";
import { createServer, getServers, startServer } from "./server";
import { addRouteToRegistry, checkEmptyParams, checkInput, checkParamIsObjectId, getRegistry, handleActive, middlewareForRouter, routeWithHandle, updateHandleActive } from "./lib/routeUtils";
import { isIErrorObject, isIModuleListing } from "./lib/helperFunctions";
import Module from './Module';
declare const Locals: any;
declare const MongoSchema: any;
declare const NotoresModule: any;
export { getConfig, writeConfig, getPackage, addConfigDefault, getConfigDefaults, getDefaultConfig, database, ModuleHandler, getModule, loadModule, loadModules, getModulesList, logger, Locals, MongoSchema, NotoresModule, Module, responseHandler, htmlResponder, jsonResponder, createServer, getServers, startServer, handleActive, updateHandleActive, routeWithHandle, middlewareForRouter, addRouteToRegistry, getRegistry, checkEmptyParams, checkParamIsObjectId, checkInput, isIErrorObject, isIModuleListing, };
//# sourceMappingURL=index.d.ts.map