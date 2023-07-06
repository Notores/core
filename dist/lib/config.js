"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeConfig = exports.getConfig = exports.getJsonFile = exports.getDefaultConfig = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const assign_deep_1 = __importDefault(require("assign-deep"));
const Logger_1 = require("./Logger");
const logger = (0, Logger_1.systemLoggerFactory)('@notores/core');
const rootDir = process.cwd();
const notoresConfigFilename = 'notores.json';
const defaultConfig = {
    authentication: {
        enabled: true,
        saltRounds: 15
    },
    jwt: {
        secretOrKey: process.env.JWT_SECRET || 'OVERWRITE THIS COOKIE PROPERTY',
        issuer: process.env.JWT_ISSUER || 'ADD_ISSUER',
        audience: process.env.JWT_AUDIENCE || 'ADD_AUDIENCE',
    },
    server: {
        accepts: ['json'],
        contentType: ['json'],
        requestSizeLimit: '1mb',
    },
    cookie: {
        useCookie: false,
    },
    swagger: {}
};
function getDefaultConfig() {
    return defaultConfig;
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
        const jsonFileString = (0, fs_1.readFileSync)(filepath, 'utf-8');
        const jsonFile = JSON.parse(jsonFileString);
        if (key)
            return jsonFile[key];
        return jsonFile;
    }
    catch (e) {
        const errorMessage = `Error loading file "${filepath}". Error: ${e.message}`;
        if (!filepath.includes(notoresConfigFilename))
            logger.error(errorMessage);
        return new Error(errorMessage);
    }
}
exports.getJsonFile = getJsonFile;
function getConfig() {
    let configFile = {};
    try {
        configFile = getJsonFile((0, path_1.join)(rootDir, './', notoresConfigFilename));
    }
    catch (e) {
        logger.error(`${notoresConfigFilename} not found, did you add on in root? Using default values.`);
    }
    const config = getDefaultConfig();
    return (0, assign_deep_1.default)(config, configFile);
}
exports.getConfig = getConfig;
function writeConfig(update, key) {
    const configContent = getJsonFile((0, path_1.join)(rootDir, './', notoresConfigFilename)) || {};
    if (key) {
        (0, assign_deep_1.default)(configContent[key], update);
    }
    else {
        (0, assign_deep_1.default)(configContent, update);
    }
    try {
        (0, fs_1.writeFileSync)((0, path_1.join)(rootDir, './', notoresConfigFilename), JSON.stringify(configContent, null, 4));
        logger.info('Updated notores config');
        return getConfig();
    }
    catch (e) {
        const errorMessage = `Error writing Notores config ${e.message}`;
        logger.error(errorMessage);
        return new Error(errorMessage);
    }
}
exports.writeConfig = writeConfig;
