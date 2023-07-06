import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { ClassType } from "../types/Notores";
export declare enum ParamTypes {
    int = "int",
    integer = "int",
    float = "float",
    bool = "boolean",
    boolean = "boolean"
}
export declare type ApiDecoratorInfo = {
    type: string;
    index: number;
    paramName: string;
    data?: Record<string, any>;
    clazz?: ClassType;
    primitiveDataType?: Function;
};
export declare function generateRoutingParameters(instance: any, pathRouteMethod: string, req: Request, res: Response, next: NextFunction): any[];
export declare function addRoutingParameterDecoratorInfoToSwagger(type: string, target: any, propertyKey: string, index: number): void;
export declare function addRoutingParameterDecoratorToFunction(type: string, target: any, propertyKey: string, index: number, data?: object): void;
export declare const routingParameterDecorators: Array<{
    type: string;
    cb: Function;
}>;
export declare function registerRoutingParameterDecorator(type: string, cb: Function): void;
export declare function ResLocals(target: any, key: string, index: number): void;
export declare function NConfig(target: any, key: string, index: number): void;
export declare function NotoresConfig(target: any, key: string, index: number): void;
export declare function NApp(target: any, key: string, index: number): void;
export declare function NotoresApp(target: any, key: string, index: number): void;
export declare function ReqUser(target: any, key: string, index: number): void;
export declare function ReqBody(target: any, key: string, index: number): void;
export declare function ReqQuery(target: any, key: string, index: number): void;
export declare function ReqParams(target: any, key: string, index: number): void;
export declare function ReqParam(paramKey: string, type?: ParamTypes): (target: any, key: string, index: number) => void;
export declare function ReqHeader(headerKey: string, type?: ParamTypes): (target: any, key: string, index: number) => void;
export declare function Req(target: any, key: string, index: number): void;
export declare function Request(target: any, key: string, index: number): void;
export declare function Res(target: any, key: string, index: number): void;
export declare function Response(target: any, key: string, index: number): void;
export declare function Next(target: any, key: string, index: number): void;
