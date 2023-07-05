import {ApiPath} from "../types/Notores";

export interface ModuleMiddlewareDecoratorOptions {
    path?: ApiPath;
    pre?: boolean;
    post?: boolean;
    authenticated?: boolean;
}
