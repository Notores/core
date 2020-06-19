import {apiParameterMetadataKey} from "../symbols";

export enum ParamTypes {
    int = 'int',
    integer = 'int',
    float = 'float',
    bool = 'boolean',
    boolean = 'boolean',
}

function addApiDecoratorToFunction(type: string, target: any, key: string, index: number, data?: object) {
    let existingApiDecorators = Reflect.getOwnMetadata(apiParameterMetadataKey, target[key]) ?? [];

    existingApiDecorators.push({type, index, data});

    Reflect.defineMetadata(apiParameterMetadataKey, existingApiDecorators, target[key]);
}

export function user(target: any, key: string, index: number) {
    addApiDecoratorToFunction('user', target, key, index);
}

export function body(target: any, key: string, index: number) {
    addApiDecoratorToFunction('body', target, key, index);
}

export function query(target: any, key: string, index: number) {
    addApiDecoratorToFunction('query', target, key, index);
}

export function params(target: any, key: string, index: number) {
    addApiDecoratorToFunction('params', target, key, index);
}

export function param(paramKey: string, type?: ParamTypes) {
    return (target: any, key: string, index: number) => {
        addApiDecoratorToFunction('param', target, key, index, {key: paramKey, type});
    }
}

export function request(target: any, key: string, index: number) {
    addApiDecoratorToFunction('request', target, key, index);
}

export function response(target: any, key: string, index: number) {
    addApiDecoratorToFunction('response', target, key, index);
}

export function next(target: any, key: string, index: number) {
    addApiDecoratorToFunction('next', target, key, index);
}
