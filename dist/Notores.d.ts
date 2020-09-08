import { IServer } from "./interfaces/IServer";
import './namespace/Notores';
export declare const SystemLogger: import("winston").Logger;
export declare class NotoresApplication {
    static entities: any[];
    static repositories: any[];
    static _app: NotoresApplication;
    modules: Array<{
        default: Function;
    } | Function>;
    controllers: any[];
    apps: IServer;
    connection: any;
    db?: string;
    static get app(): NotoresApplication;
    static create(modules: Function[]): Promise<NotoresApplication>;
    constructor(modules: Function[]);
    setup(): Promise<void>;
    bindModules(): void;
    addConnectionToRequest(): void;
    start(port?: Number | String | undefined): void;
}
//# sourceMappingURL=Notores.d.ts.map