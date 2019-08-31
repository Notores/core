import {IDefaultConfigObject, IErrorObject, INotoresConfig} from "../../Types";

const assign = require('assign-deep');
const {readFileSync, writeFileSync} = require('fs');
const logger = require('../../logger')(module);
const {join} = require('path');

const rootDir = process.cwd();
const notoresConfigFileName = 'notores.json';

const configDefaults: IDefaultConfigObject[] = [];

export function addConfigDefault(obj: IDefaultConfigObject): void {
    configDefaults.push(obj);
}

export function getConfigDefaults(): IDefaultConfigObject[] {
    return configDefaults;
}

export function getDefaultConfig(): Object {
    const obj = {};
    configDefaults.forEach((defaultConfigObject:IDefaultConfigObject )=> {
        const conf = {};
        // @ts-ignore
        conf[defaultConfigObject.key] = defaultConfigObject.value;
        assign(obj, conf);
    });
    return obj;
}

/**
 * Loads the JSON file through readFileSync on the given path. It loads the file with encoding 'utf-8'
 * @param {String} filepath The filepath to load the JSON file fromt
 * @param {String} key A specific key to load from the JSON file
 * @return {Object|{error: string}}
 * @example const result = getJsonFile(`${process.cwd()}/package.j son`, authors);
 */
export function getJsonFile(filepath: string, key?: string): INotoresConfig | IErrorObject {
    try {
        const jsonFileString = readFileSync(filepath, 'utf-8');
        const jsonFile = JSON.parse(jsonFileString);
        if (key)
            return jsonFile[key];
        return jsonFile;
    } catch (e) {
        const errorMessage = `Error loading file "${filepath}". Error: ${e.message}`;
        logger.error(errorMessage);
        return {
            error: errorMessage
        }
    }
}

export function getConfig(key?: string): INotoresConfig {
    const configFile = getJsonFile(join(rootDir, './', notoresConfigFileName), key);
    const config: Object = getDefaultConfig();

    assign(config, configFile);

    return <INotoresConfig>config;
}

export function getPackage(key: string): Object {
    return getJsonFile(join(rootDir, './', 'package.json'), key);
}

export function writeConfig(obj: Object, key: string): INotoresConfig | IErrorObject {
    const notoresConfig = getConfig();
    let newConfig;
    if (key) {
        newConfig = {
            ...notoresConfig
        };
        // @ts-ignore
        newConfig[key] = {...newConfig[key],
            ...obj,
        };
    } else {
        newConfig = {
            ...notoresConfig,
            ...obj,
        };
    }

    try {
        writeFileSync(join(rootDir, './', notoresConfigFileName), JSON.stringify(newConfig, null, 4));
        logger.info('Updated notores config');
        return newConfig;
    } catch (e) {
        const errorMessage = `Error writing Notores config ${e.message}`;
        logger.error(errorMessage);
        return {
            error: errorMessage
        }
    }
}
