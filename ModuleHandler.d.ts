/// <reference types="node" />
import Module = NodeJS.Module;
export interface IModuleListing {
    name: string;
    absolutePath: string;
}
export declare function getModule(moduleName: string): Module | any;
export declare function loadModule(name: string, path: string): Module | any;
export declare function isIModuleListing(object: any): object is IModuleListing;
export declare function loadModules(): void;
export declare function getModulesList(): IModuleListing[];
//# sourceMappingURL=ModuleHandler.d.ts.map