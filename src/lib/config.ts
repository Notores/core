import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import assign from 'assign-deep';
import {systemLoggerFactory} from "./Logger";
import { Notores } from '../types/Notores';

const logger = systemLoggerFactory('@notores/core');
const rootDir = process.cwd();
const notoresConfigFilename = 'notores.json';

const defaultConfig: Notores.Config = {
    authentication: {
        enabled: true,
        saltRounds: 15
    },
    jwt: {
        secretOrKey: process.env.JWT_SECRET || 'OVERWRITE THIS COOKIE PROPERTY', // TODO Maybe autogenerate notores.json file if not set??
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
}

export function getDefaultConfig(): Notores.Config {
    return defaultConfig;
}

/**
 * Loads the JSON file through readFileSync on the given path. It loads the file with encoding 'utf-8'
 * @param {String} filepath The filepath to load the JSON file fromt
 * @param {String} key A specific key to load from the JSON file
 * @return {Object|{error: string}}`
 * @example const result = getJsonFile(`${process.cwd()}/package.j son`, authors);
 */
export function getJsonFile<T extends Notores.Config>(filepath: string, key?: keyof T): Notores.Config | Error {
    try {
        const jsonFileString = readFileSync(filepath, 'utf-8');
        const jsonFile = JSON.parse(jsonFileString);
        if (key)
            return jsonFile[key];
        return jsonFile;
    } catch (e) {
        const errorMessage = `Error loading file "${filepath}". Error: ${e.message}`;
        if (!filepath.includes(notoresConfigFilename))
            logger.error(errorMessage);
        return new Error(errorMessage);
    }
}

export function getConfig<T extends Notores.Config>(): T {
    let configFile: Notores.Config | {} = {};
    try {
        configFile = getJsonFile(join(rootDir, './', notoresConfigFilename));
    } catch (e) {
        logger.error(`${notoresConfigFilename} not found, did you add on in root? Using default values.`)
    }
    const config: Notores.Config = getDefaultConfig();

    return assign(config, configFile);
}

export function writeConfig<T extends Notores.Config>(update: Record<string, any>, key?: string): T | Error {
    const configContent: Notores.Config | {} = getJsonFile(join(rootDir, './', notoresConfigFilename)) || {};

    if (key) {
        assign(configContent[key], update);
    } else {
        assign(configContent, update);
    }

    try {
        writeFileSync(join(rootDir, './', notoresConfigFilename), JSON.stringify(configContent, null, 4));
        logger.info('Updated notores config');
        return getConfig<T>();
    } catch (e) {
        const errorMessage = `Error writing Notores config ${e.message}`;
        logger.error(errorMessage);
        return new Error(errorMessage);
    }
}