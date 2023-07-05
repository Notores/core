import { apiMetadataKey, middlewareMetadataKey, moduleMetadataKey } from "../../symbols";
import { getClassMethodsByDecoratedProperty } from "./helpers";
import { bindMiddlewares } from "./BindMiddleware";
import { bindPaths } from "./BindPaths";
import { moduleLoggerFactory } from "../Logger";
export function bindControllers(app) {
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
        const moduleMetaData = Reflect.getOwnMetadata(moduleMetadataKey, Clazz);
        if (moduleMetaData.swaggerTag) {
            app.swaggerRegistry.tags.push(moduleMetaData.swaggerTag);
        }
        /** Bind @Use **/
        const middlewareDeclarationMethods = getClassMethodsByDecoratedProperty(Clazz, middlewareMetadataKey);
        bindMiddlewares({
            ...sharedBindParams,
            middlewareDeclarationMethods,
        });
        /** Bind all paths (@Get{Id} | @Post | @Put{Id} | @Patch{Id} | @Delete{Id} **/
        const pathRouteMethods = getClassMethodsByDecoratedProperty(Clazz, apiMetadataKey);
        bindPaths({
            ...sharedBindParams,
            pathRouteMethods,
            operations: swaggerOperations,
        });
        instance.logger = moduleLoggerFactory(moduleMetaData.targetName);
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
