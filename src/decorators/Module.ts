import 'reflect-metadata'
import {ModuleDecoratorOptions} from '../interfaces/ModuleDecoratorOptions';
import ModuleMetaData from "../lib/ModuleMetaData";
import {moduleMetadataKey} from "../symbols";

export function Module(none: undefined): ClassDecorator;
export function Module(path?: string): ClassDecorator;
export function Module(settings?: ModuleDecoratorOptions): ClassDecorator;
export function Module(settings: any): ClassDecorator {
    return function (target: Function) {
        const filePath = getFilePath();
        const metadata: ModuleMetaData = new ModuleMetaData(target, filePath);

        if (!settings) {
            metadata.responseIsBody = false;
        } else if (typeof settings === 'string') {
            metadata.responseIsBody = false;
            metadata.prefix = settings;
        } else {
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


        Reflect.defineMetadata(moduleMetadataKey, metadata, target);
        // target[ROOT_ROUTE] = settings?.prefix?.startsWith('/') ? settings.prefix : `/${settings.prefix}`;
        // target[DATA_KEY] = settings.dataKey;
        // target[IGNORE_DATA_KEY] = settings.responseAsBody;
        // target[MODULE_PATH] = filePath;
    }
}

function getFilePath() {
    const err = new Error();
    const stack = err.stack;
    const stackArr = stack!.split('\n');
    stackArr.shift();
    let filePathStringStack = '';
    for (let str of stackArr) {
        if (str.includes('__decorate')) {
            filePathStringStack = str;
        }
    }
    const filePathStr = /\(.*\)/im[Symbol.match](filePathStringStack)![0];
    // @ts-ignore
    const fileStrArr = new RegExp(/(\/[a-z-.]+)/gim)[Symbol.match](filePathStr);
    fileStrArr!.pop();

    return fileStrArr!.join('');
}
