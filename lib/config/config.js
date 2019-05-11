const {readFileSync, writeFileSync} = require('fs');
const logger = require('../../logger')(module);
const {join} = require('path');

const rootDir = process.cwd();
const notoresConfigFileName = 'notores.json';

function getJsonFile(filepath, key) {
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

function getConfig(key) {
    const config = getJsonFile(join(rootDir, './', notoresConfigFileName), key);
    if (config.error) {
        config.login = {
            fields: [
                'email'
            ],
            saltRounds: 10,
        }
    }
    return config;
}

function getPackage(key) {
    return getJsonFile(join(rootDir, './', 'package.json'), key);
}

function writeConfig(obj, key) {
    const notoresConfig = getConfig();
    let newConfig;
    if (key) {
        newConfig = {
            ...notoresConfig
        };
        newConfig[key] = {
            ...newConfig[key],
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

module.exports = {
    getConfig,
    writeConfig,
    getPackage,
};
