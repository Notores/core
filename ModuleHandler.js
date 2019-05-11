const {join} = require('path');
const logger = require('./logger')(module);
const {getPackage} = require('./lib/config');

const baseModules = [
    // {name: '@notores/user', absolutePath: './modules/user'}, //temp disabled till this is tested
    {name: '@notores/shared-models', absolutePath: './modules/shared-models'},
];

const modules = [];

function getModule(moduleName) {
    if (!moduleName)
        throw new Error('getModule was called without a value for moduleName');

    try {
        const registeredModule = modules.find(mod => mod.name === moduleName);
        let mod;
        if (registeredModule)
            mod = require(registeredModule.absolutePath);
        else
            mod = require(moduleName);
        mod.installed = true;
        return mod;
    } catch (e) {
        return {
            installed: false
        };
    }
}

function loadModule(name, path) {
    const result = getModule(name);
    if (result.installed)
        return result;

    if (!path)
        path = name;

    if (path.indexOf(':root') === 0) {
        const rootDir = process.cwd();
        path = join(rootDir, path.replace(':root', ''));
    }

    try {
        const mod = require(path);
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

function loadModules() {
    const packageNotoresConfig = getPackage('notores');

    let mods = [...baseModules];

    if (packageNotoresConfig.hasOwnProperty('modules') && packageNotoresConfig.modules.length > 0) {
        mods.push(...packageNotoresConfig.modules);
    }

    mods = mods.map(mod => {
        if (mod.name)
            return mod;

        return {name: mod, absolutePath: mod};
    });

    mods.forEach(({name, absolutePath}) => loadModule(name, absolutePath));
}


function getModulesList() {
    return modules;
}

module.exports = {
    getModule,
    loadModule,
    loadModules,
    getModulesList
};
