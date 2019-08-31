import Module = NodeJS.Module;
import {isIModuleListing} from "./lib/helperFunctions";

export interface IModuleListing {
    name: string,
    absolutePath: string,
}

const {join} = require('path');
const logger = require('./logger')(module);
const {getPackage} = require('./lib/config');

const baseModules: IModuleListing[] = [
    {name: '@notores/user', absolutePath: './modules/user'},
    {name: '@notores/shared-models', absolutePath: './modules/shared-models'},
];

const modules: IModuleListing[] = [];

export function getModule(moduleName: string): Module | any {
    if (!moduleName)
        throw new Error('getModule was called without a value for moduleName');

    try {
        const registeredModule: IModuleListing | undefined = modules.find(mod => mod.name === moduleName);
        let mod;
        if (registeredModule) {
            mod = require(registeredModule.absolutePath);
        } else
            mod = require(moduleName);
        mod.installed = true;
        return mod;
    } catch (e) {
        return {
            installed: false
        };
    }
}

export function loadModule(name: string, path: string): Module | any {
    const result = getModule(name);

    if (!result.installed) {
        if (!path)
            path = name;

        if (path.indexOf(':root') === 0) {
            const rootDir = process.cwd();
            path = join(rootDir, path.replace(':root', ''));
        }
    }
    try {
        const mod = require(path);
        if (mod.init)
            mod.init();
        modules.push({name, absolutePath: path});
        mod.installed = true;
        return mod;
    } catch (e) {
        logger.error(`Failed loading module ${name}: ${e.message}`);
        logger.error(e.stack);
        return {
            installed: false
        };
    }
}

export function loadModules(): void {
    const packageNotoresConfig = getPackage('notores');
    let mods: IModuleListing[] = [...baseModules];

    if (packageNotoresConfig.hasOwnProperty('modules') && packageNotoresConfig.modules.length > 0) {
        mods.push(...packageNotoresConfig.modules);
    }

    mods = mods.map((mod: IModuleListing | string): IModuleListing => {
        if (isIModuleListing(mod)) {
            return mod;
        }

        return {name: mod, absolutePath: mod};
    });

    mods.forEach(({name, absolutePath}) => loadModule(name, absolutePath));
}

export function getModulesList(): IModuleListing[] {
    return modules;
}
