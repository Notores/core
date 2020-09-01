import '../namespace/Notores';
import {readFileSync, writeFileSync} from 'fs';
import {loggerFactory} from "./logger";
import {join} from 'path';
import { IThemeConfig } from '../namespace/Notores';

const assign = require('assign-deep');

const logger = loggerFactory(module);

const rootDir = process.cwd();
const notoresConfigFileName = 'notores.json';

const defaultCoreConfig: object = {
    authentication: {
        enabled: true,
        usernameField: 'email',
        saltRounds: 15,
    },
    jwt: {
        secretOrKey: 'OVERWRITE THIS COOKIE PROPERTY', // TODO Maybe autogenerate notores.json file if not set??
        issuer: 'ADD_ISSUER',
        audience: 'ADD_AUDIENCE',
    },
    useCookie: false,
};
const defaultThemeConfig: IThemeConfig = {
    public: {
        name: "notores",
        isApp: false,
    },
    admin: {
        name: "notores",
        isApp: false,
    },
};

const configDefaults: Notores.IConfigObject[] = [
    {
        key: 'main',
        value: defaultCoreConfig
    }, {
        key: 'theme',
        value: defaultThemeConfig
    }
];

export function addConfigDefault(obj: Notores.IConfigObject): void {
    configDefaults.push(obj);
}

export function getConfigDefaults(): Notores.IConfigObject[] {
    return configDefaults;
}

export function getDefaultConfig(): Notores.IConfigObject {
    const obj = {};
    getConfigDefaults().forEach((defaultConfigObject: Notores.IConfigObject) => {
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
 * @return {Object|{error: string}}`
 * @example const result = getJsonFile(`${process.cwd()}/package.j son`, authors);
 */
export function getJsonFile(filepath: string, key?: string): Notores.IConfigObject | Error {
    try {
        const jsonFileString = readFileSync(filepath, 'utf-8');
        const jsonFile = JSON.parse(jsonFileString);
        if (key)
            return jsonFile[key];
        return jsonFile;
    } catch (e) {
        const errorMessage = `Error loading file "${filepath}". Error: ${e.message}`;
        logger.error(errorMessage);
        return new Error(errorMessage);
    }
}

export function getConfig(key?: string): Notores.IConfig {
    const configFile = getJsonFile(join(rootDir, './', notoresConfigFileName), key) || {};
    const config: Object = getDefaultConfig();

    assign(config, configFile);

    return <Notores.IConfig>config;
}

export function getPackage(key: string): Object {
    return getJsonFile(join(rootDir, './', 'package.json'), key);
}

export function writeConfig(obj: Object, key: string): Notores.IConfig | Error {
    const notoresConfig: Notores.IConfig = getConfig();
    let newConfig: Notores.IConfig;
    if (key) {
        newConfig = {
            ...notoresConfig
        };

        newConfig[key] = {
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
        return new Error(errorMessage);
    }
}
