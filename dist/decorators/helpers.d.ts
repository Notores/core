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
//# sourceMappingURL=helpers.d.ts.map