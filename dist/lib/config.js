"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeConfig = exports.getPackage = exports.getConfig = exports.getJsonFile = exports.getDefaultConfig = exports.getConfigDefaults = exports.addConfigDefault = void 0;
require("../namespace/Notores");
const fs_1 = require("fs");
const logger_1 = require("./logger");
const path_1 = require("path");
const assign = require('assign-deep');
const logger = logger_1.loggerFactory(module);
const rootDir = process.cwd();
const notoresConfigFileName = 'notores.json';
const defaultCoreConfig = {
    authentication: {
        enabled: true,
        usernameField: 'email',
        saltRounds: 15,
    },
    jwt: {
        secretOrKey: 'OVERWRITE THIS COOKIE PROPERTY',
        issuer: 'ADD_ISSUER',
        audience: 'ADD_AUDIENCE',
    },
    requests: {
        responseTypes: ['html', 'json'],
    },
    useCookie: false,
};
const defaultThemeConfig = {
    public: {
        name: "notores",
        isApp: false,
    },
    admin: {
        name: "notores",
        isApp: false,
    },
};
const configDefaults = [
    {
        key: 'main',
        value: defaultCoreConfig
    }, {
        key: 'theme',
        value: defaultThemeConfig
    }
];
function addConfigDefault(obj) {
    configDefaults.push(obj);
}
exports.addConfigDefault = addConfigDefault;
function getConfigDefaults() {
    return configDefaults;
}
exports.getConfigDefaults = getConfigDefaults;
function getDefaultConfig() {
    const obj = {};
    getConfigDefaults().forEach((defaultConfigObject) => {
        const conf = {};
        // @ts-ignore
        conf[defaultConfigObject.key] = defaultConfigObject.value;
        assign(obj, conf);
    });
    return obj;
}
exports.getDefaultConfig = getDefaultConfig;
/**
 * Loads the JSON file through readFileSync on the given path. It loads the file with encoding 'utf-8'
 * @param {String} filepath The filepath to load the JSON file fromt
 * @param {String} key A specific key to load from the JSON file
 * @return {Object|{error: string}}`
 * @example const result = getJsonFile(`${process.cwd()}/package.j son`, authors);
 */
function getJsonFile(filepath, key) {
    try {
        const jsonFileString = fs_1.readFileSync(filepath, 'utf-8');
        const jsonFile = JSON.parse(jsonFileString);
        if (key)
            return jsonFile[key];
        return jsonFile;
    }
    catch (e) {
        const errorMessage = `Error loading file "${filepath}". Error: ${e.message}`;
        logger.error(errorMessage);
        return new Error(errorMessage);
    }
}
exports.getJsonFile = getJsonFile;
function getConfig(key) {
    const configFile = getJsonFile(path_1.join(rootDir, './', notoresConfigFileName), key) || {};
    const config = getDefaultConfig();
    assign(config, configFile);
    return config;
}
exports.getConfig = getConfig;
function getPackage(key) {
    return getJsonFile(path_1.join(rootDir, './', 'package.json'), key);
}
exports.getPackage = getPackage;
function writeConfig(obj, key) {
    const notoresConfig = getConfig();
    let newConfig;
    if (key) {
        newConfig = {
            ...notoresConfig
        };
        newConfig[key] = {
            ...obj,
        };
    }
    else {
        newConfig = {
            ...notoresConfig,
            ...obj,
        };
    }
    try {
        fs_1.writeFileSync(path_1.join(rootDir, './', notoresConfigFileName), JSON.stringify(newConfig, null, 4));
        logger.info('Updated notores config');
        return newConfig;
    }
    catch (e) {
        const errorMessage = `Error writing Notores config ${e.message}`;
        logger.error(errorMessage);
        return new Error(errorMessage);
    }
}
exports.writeConfig = writeConfig;
