import 'reflect-metadata'
import {ModuleDecoratorOptions} from '../interfaces';
import {ApiMetaData, getClassMethodsByDecoratedProperty, ModuleMetaData} from "../lib";
import {apiMetadataKey, moduleMetadataKey} from "../symbols";

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
            if(settings.swaggerTag) {
                metadata.swaggerTag = settings.swaggerTag || {name: target.name.replace('Module', '')};
            } else if (settings.swaggerTag === false) {
                metadata.swaggerTag = undefined;
            }

        }

        Reflect.defineMetadata(moduleMetadataKey, metadata, target);

        setPathDefaults(target, metadata);
    }
}

function setPathDefaults(target: any, metadata: ModuleMetaData) {
    try {

        const pathRouteMethods = getClassMethodsByDecoratedProperty(target, apiMetadataKey);
        for (const propertyKey of pathRouteMethods) {
            const existingApiMetaData: ApiMetaData = Reflect.getOwnMetadata(apiMetadataKey, target.prototype[propertyKey]);
            existingApiMetaData.addPathPrefix(metadata.prefix);
            if (existingApiMetaData.addSwagger) {
                existingApiMetaData
                    .addDefaultResponse(metadata.dataKey)
                    .addDefaultParameter(target)
                    .setResponses(metadata.dataKey);

                if(metadata.swaggerTag) {
                    existingApiMetaData.addTag(metadata.swaggerTag.name);
                }
                existingApiMetaData.save();
            }
        }
    } catch (e) {
        console.log('error setting pathDefaults', e);
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
