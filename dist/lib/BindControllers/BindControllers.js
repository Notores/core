"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindControllers = void 0;
const symbols_1 = require("../../symbols");
const helpers_1 = require("./helpers");
const BindMiddleware_1 = require("./BindMiddleware");
const BindPaths_1 = require("./BindPaths");
const Logger_1 = require("../Logger");
function bindControllers(app) {
    const { apps: server, modules: controllers } = app;
    const ctrls = [];
    const mods = [];
    const swaggerOperations = {};
    let swaggerTag = null;
    for (const Clazz of controllers) {
        const instance = new Clazz();
        ctrls.push(instance);
        const mod = {
            CLASS: Clazz,
            routes: [],
        };
        const sharedBindParams = {
            instance,
            Clazz,
            mod,
            server,
        };
        const moduleMetaData = Reflect.getOwnMetadata(symbols_1.moduleMetadataKey, Clazz);
        if (moduleMetaData.swaggerTag) {
            app.swaggerRegistry.tags.push(moduleMetaData.swaggerTag);
        }
        /** Bind @Use **/
        const middlewareDeclarationMethods = (0, helpers_1.getClassMethodsByDecoratedProperty)(Clazz, symbols_1.middlewareMetadataKey);
        (0, BindMiddleware_1.bindMiddlewares)(Object.assign(Object.assign({}, sharedBindParams), { middlewareDeclarationMethods }));
        /** Bind all paths (@Get{Id} | @Post | @Put{Id} | @Patch{Id} | @Delete{Id} **/
        const pathRouteMethods = (0, helpers_1.getClassMethodsByDecoratedProperty)(Clazz, symbols_1.apiMetadataKey);
        (0, BindPaths_1.bindPaths)(Object.assign(Object.assign({}, sharedBindParams), { pathRouteMethods, operations: swaggerOperations }));
        instance.logger = (0, Logger_1.moduleLoggerFactory)(moduleMetaData.targetName);
        mods.push(mod);
    }
    app.swaggerRegistry.paths = swaggerOperations;
    app.controllers = ctrls;
    app.registeredModules = mods;
    return {
        ctrls,
        registeredModules: mods,
        swaggerOperations
    };
}
exports.bindControllers = bindControllers;
