import {ApiMethodPath, ClassType, Notores} from "../../types/Notores";
import {OpenAPIV3} from "openapi-types";
import {ModuleMetaData} from "../ModuleMetaData";
import {ApiMetaData} from "../ApiMetaData";

export type Paths = Array<{ [key: string]: any }>
export type RegisteredModule = {
    CLASS: ClassType;
    routes: Array<RegisteredRoute>;
}

export type RegisteredRoute = {
    METHOD: string;
    ROUTE: ApiMethodPath;
    RESTRICTED: boolean;
    AUTH: boolean;
    AUTH_REDIRECT: boolean;
    ROLES: string[];
    FUNC: string;
    PRE_MIDDLE?: number | null;
    POST_MIDDLE?: number | null;
}


export type SharedBindParams = {
    instance: object;
    Clazz: ClassType,
    mod: RegisteredModule;
    server: Notores.Server;
}

/** Bind for @Use **/
export type BindMiddlewares = SharedBindParams & {
    middlewareDeclarationMethods: string[];
}

export type BindMiddleware = SharedBindParams & {
    middlewareDeclarationMethod: string;
}

/** Types for paths (@Get{Id} | @Post | @Put{Id} | @Patch{Id} | @Delete{Id} **/
export type BindPaths = SharedBindParams & {
    pathRouteMethods: string[];
    operations: OpenAPIV3.PathsObject;
}

export type BindPath = SharedBindParams & {
    pathRouteMethod: string;
    operations: OpenAPIV3.PathsObject;
}

export type BindSwaggerDoc = SharedBindParams & {
    operations: OpenAPIV3.PathsObject;
    route: string | RegExp;
    moduleMetaData: ModuleMetaData;
    apiMetaData: ApiMetaData;
}

