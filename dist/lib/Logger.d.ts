/// <reference types="node" />
import { Logger } from "winston";
export declare function loggerFactory(callingModule: NodeModule | string): Logger;
export declare function moduleLoggerFactory(moduleName: NodeModule | string): Logger;
export declare function systemLoggerFactory(loggerLabel: string | NodeModule): Logger;
