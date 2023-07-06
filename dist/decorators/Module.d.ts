import 'reflect-metadata';
import { ModuleDecoratorOptions } from '../interfaces';
export declare function Module(none: undefined): ClassDecorator;
export declare function Module(path?: string): ClassDecorator;
export declare function Module(settings?: ModuleDecoratorOptions): ClassDecorator;
