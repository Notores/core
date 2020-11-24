/// <reference types="qs" />
import { NextFunction, Request, Response } from 'express';
export declare enum ParamTypes {
    int = "int",
    integer = "int",
    float = "float",
    bool = "boolean",
    boolean = "boolean"
}
export declare function generateRoutingParameters(instance: any, pathRouteMethod: string, req: Request, res: Response, next: NextFunction): (Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs> | Response<any> | NextFunction)[];
export declare function addRoutingParameterDecoratorToFunction(type: string, target: any, key: string, index: number, data?: object): void;
export declare const routingParameterDecorators: Array<{
    type: string;
    cb: Function;
}>;
export declare function registerRoutingParameterDecorator(type: string, cb: Function): void;
export declare function config(target: any, key: string, index: number): void;
export declare function user(target: any, key: string, index: number): void;
export declare function body(target: any, key: string, index: number): void;
export declare function query(target: any, key: string, index: number): void;
export declare function params(target: any, key: string, index: number): void;
export declare function param(paramKey: string, type?: ParamTypes): (target: any, key: string, index: number) => void;
export declare function request(target: any, key: string, index: number): void;
export declare function response(target: any, key: string, index: number): void;
export declare function next(target: any, key: string, index: number): void;
//# sourceMappingURL=Api.d.ts.map