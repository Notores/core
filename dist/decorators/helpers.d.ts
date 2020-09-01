import 'reflect-metadata';
import { IServer } from "../interfaces/IServer";
export declare const paths: {
    [key: string]: any;
};
/**
 * Attaches the router controllers to the main express application instance.
 * @param server - express application instance (result of call to `express()`)
 * @param controllers - controller classes (rest parameter) decorated with @Root and @Path/@Use
 */
export declare function bindControllers(server: IServer, controllers: Function[]): any[];
/**
 * Send a warning to console and logs if authentication is not enabled
 * @param decorator - the name of the decorator
 * @param controller - controller that contains the function that was decorated
 * @param func - the function name that was decorated by an authentication related decorator
 */
export declare function logWarningIfNoAuthentication(decorator: string, controller: string, func: string): void;
//# sourceMappingURL=helpers.d.ts.map