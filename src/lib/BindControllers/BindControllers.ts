import {ClassType, Notores} from "../../types/Notores";
import {apiMetadataKey, middlewareMetadataKey, moduleMetadataKey} from "../../symbols";
import {getClassMethodsByDecoratedProperty} from "./helpers";
import {bindMiddlewares} from "./BindMiddleware";
import {bindPaths} from "./BindPaths";
import {RegisteredModule, SharedBindParams} from "./types";
import {moduleLoggerFactory} from "../Logger";
import {ModuleMetaData} from "../ModuleMetaData";
import {OpenAPIV3} from "openapi-types";
import Application = Notores.Application;

export function bindControllers(app: Notores.Application): {
    ctrls: object[];
    registeredModules: Array<RegisteredModule>;
    swaggerOperations: OpenAPIV3.PathsObject;
    tag?: OpenAPIV3.TagObject;
} {
    const {apps: server, modules: controllers} = app;
    const ctrls = [];
    const mods: Array<RegisteredModule> = [];
    const swaggerOperations: OpenAPIV3.PathsObject = {};
    let swaggerTag = null;

    for (const Clazz of controllers) {
        const instance = new (<any>Clazz)();
        ctrls.push(instance);

        const mod: RegisteredModule = {
            CLASS: Clazz,
            routes: [],
        }

        const sharedBindParams: SharedBindParams = {
            instance,
            Clazz,
            mod,
            server,
        }

        const moduleMetaData: ModuleMetaData = Reflect.getOwnMetadata(moduleMetadataKey, Clazz);
        if(moduleMetaData.swaggerTag) {
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
        })

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
    }
}
