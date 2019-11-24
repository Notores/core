/// <reference types="node" />
import { Logger } from "winston";
import Module = NodeJS.Module;
export default function newLogger(callingModule: Module): Logger;
export declare const initLogger: typeof newLogger;
//# sourceMappingURL=logger.d.ts.map