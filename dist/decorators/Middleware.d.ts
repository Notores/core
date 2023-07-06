import { ModuleMiddlewareDecoratorOptions } from "../interfaces";
export declare function Use(middlewares?: ModuleMiddlewareDecoratorOptions): (target: any, propertyKey: string) => void;
