"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
require("reflect-metadata");
const ModuleMetaData_1 = __importDefault(require("../lib/ModuleMetaData"));
const symbols_1 = require("../symbols");
function Module(settings) {
    return function (target) {
        const filePath = getFilePath();
        const metadata = new ModuleMetaData_1.default(target, filePath);
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
        }
        Reflect.defineMetadata(symbols_1.moduleMetadataKey, metadata, target);
        // target[ROOT_ROUTE] = settings?.prefix?.startsWith('/') ? settings.prefix : `/${settings.prefix}`;
        // target[DATA_KEY] = settings.dataKey;
        // target[IGNORE_DATA_KEY] = settings.responseAsBody;
        // target[MODULE_PATH] = filePath;
    };
}
exports.Module = Module;
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
