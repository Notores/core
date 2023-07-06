import { MainResponder, SwaggerRegistry } from "./lib";
import { ClassType, Mod, Notores } from "./types/Notores";
export declare const SystemLogger: import("winston").Logger;
export declare class NotoresApplication extends Notores.Application {
    #private;
    static entities: any[];
    static repositories: any[];
    static _app: NotoresApplication;
    static get app(): NotoresApplication | null;
    static create(modules: Mod[]): Promise<NotoresApplication>;
    modules: Array<ClassType>;
    controllers: any[];
    responders: MainResponder[];
    swaggerRegistry: SwaggerRegistry;
    registeredModules: any[];
    constructor();
    rebuild(): Promise<void>;
    private preBuildNotoresApp;
    private buildNotoresApp;
    addModule(module: Mod): this;
    setup(options?: Notores.ApplicationSetup): this;
    bindModules({ logModules }: Notores.ApplicationSetup): this;
    logModules(options: true | ClassType[]): this;
    start(port?: Number | String | undefined): this;
    stop(): Promise<void>;
}
