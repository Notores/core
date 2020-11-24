import {apiParameterMetadataKey} from "../symbols";
import {NextFunction, Request, Response} from 'express';

export enum ParamTypes {
    int = 'int',
    integer = 'int',
    float = 'float',
    bool = 'boolean',
    boolean = 'boolean',
}

export function generateRoutingParameters(instance: any, pathRouteMethod: string, req: Request, res: Response, next: NextFunction) {
    const params = [];
    let existingApiDecorators = Reflect.getOwnMetadata(apiParameterMetadataKey, instance[pathRouteMethod]) ?? [];
    existingApiDecorators.forEach((d: { type: string, index: number, data?: any }) => {
        const dec = routingParameterDecorators.find((dec) => dec.type === d.type)

        if(!dec)
            return;

        params[d.index] = dec.cb(d.data, req, res, next);
    });

    params.push(req);
    params.push(res);
    params.push(next);
    return params;
}

export function addRoutingParameterDecoratorToFunction(type: string, target: any, key: string, index: number, data?: object) {
    let existingApiDecorators = Reflect.getOwnMetadata(apiParameterMetadataKey, target[key]) ?? [];

    existingApiDecorators.push({type, index, data});

    Reflect.defineMetadata(apiParameterMetadataKey, existingApiDecorators, target[key]);
}

export const routingParameterDecorators: Array<{type: string, cb: Function}> = [];

export function registerRoutingParameterDecorator(type: string, cb: Function) {
    routingParameterDecorators.push({type, cb})
}

registerRoutingParameterDecorator('config', (data: any, req: Request) => req.notores);

registerRoutingParameterDecorator('user', (data: any, req: Request) => req.user);

registerRoutingParameterDecorator('body', (data: any, req: Request) => req.body);

registerRoutingParameterDecorator('query', (data: any, req: Request) => req.query);

registerRoutingParameterDecorator('params', (data: any, req: Request) => req.params);

registerRoutingParameterDecorator('param', (data: any, req: Request) => {
    let val: any = req.params[data!.key]
    if (data!.type) {
        switch (data!.type) {
            case ParamTypes.int:
            case ParamTypes.integer:
                val = parseInt(val);
                break;
            case ParamTypes.float:
                val = parseFloat(val);
                break;
            case ParamTypes.bool:
            case ParamTypes.boolean:
                val = !!val;
                break;
        }
    }

    return val;
});

registerRoutingParameterDecorator('request', (data: any, req: Request) => req);

registerRoutingParameterDecorator('response', (data: any, req: Request, res: Response) => res);

registerRoutingParameterDecorator('next', (data: any, req: Request, res: Response, next: NextFunction) => next);

export function config(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('config', target, key, index);
}

export function user(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('user', target, key, index);
}

export function body(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('body', target, key, index);
}

export function query(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('query', target, key, index);
}

export function params(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('params', target, key, index);
}

export function param(paramKey: string, type?: ParamTypes) {
    return (target: any, key: string, index: number) => {
        addRoutingParameterDecoratorToFunction('param', target, key, index, {key: paramKey, type});
    }
}

export function request(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('request', target, key, index);
}

export function response(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('response', target, key, index);
}

export function next(target: any, key: string, index: number) {
    addRoutingParameterDecoratorToFunction('next', target, key, index);
}
