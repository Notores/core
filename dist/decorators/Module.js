"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
require("reflect-metadata");
const lib_1 = require("../lib");
const symbols_1 = require("../symbols");
function Module(settings) {
    return function (target) {
        const filePath = getFilePath();
        const metadata = new lib_1.ModuleMetaData(target, filePath);
        if (!settings) {
            metadata.responseIsBody = false;
        }
        else if (typeof settings === 'string') {
            metadata.responseIsBody = false;
            metadata.prefix = settings;
        }
        else {
            if (settings.key) {
                metadata.key = settings.key;
            }
            if (settings.prefix) {
                metadata.prefix = settings.prefix;
            }
            if (settings.dataKey) {
                metadata.dataKey = settings.dataKey;
            }
            if (settings.responseAsBody) {
                metadata.responseIsBody = settings.responseAsBody;
            }
            if (settings.entity) {
                metadata.entity = settings.entity;
            }
            if (settings.entities) {
                metadata.entities = settings.entities;
            }
            if (settings.repository) {
                metadata.repository = settings.repository;
            }
            if (settings.swaggerTag) {
                metadata.swaggerTag = settings.swaggerTag || { name: target.name.replace('Module', '') };
            }
            else if (settings.swaggerTag === false) {
                metadata.swaggerTag = undefined;
            }
        }
        Reflect.defineMetadata(symbols_1.moduleMetadataKey, metadata, target);
        setPathDefaults(target, metadata);
    };
}
exports.Module = Module;
function setPathDefaults(target, metadata) {
    try {
        const pathRouteMethods = (0, lib_1.getClassMethodsByDecoratedProperty)(target, symbols_1.apiMetadataKey);
        for (const propertyKey of pathRouteMethods) {
            const existingApiMetaData = Reflect.getOwnMetadata(symbols_1.apiMetadataKey, target.prototype[propertyKey]);
            existingApiMetaData.addPathPrefix(metadata.prefix);
            if (existingApiMetaData.addSwagger) {
                existingApiMetaData
                    .addDefaultResponse(metadata.dataKey)
                    .addDefaultParameter(target)
                    .setResponses(metadata.dataKey);
                if (metadata.swaggerTag) {
                    existingApiMetaData.addTag(metadata.swaggerTag.name);
                }
                existingApiMetaData.save();
            }
        }
    }
    catch (e) {
        console.log('error setting pathDefaults', e);
    }
}
function getFilePath() {
    const err = new Error();
    const stack = err.stack;
    const stackArr = stack.split('\n');
    stackArr.shift();
    let filePathStringStack = '';
    for (let str of stackArr) {
        if (str.includes('__decorate')) {
            filePathStringStack = str;
        }
    }
    const filePathStr = /\(.*\)/im[Symbol.match](filePathStringStack)[0];
    // @ts-ignore
    const fileStrArr = new RegExp(/(\/[a-z-.]+)/gim)[Symbol.match](filePathStr);
    fileStrArr.pop();
    return fileStrArr.join('');
}
