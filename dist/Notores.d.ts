import { IServer } from "./interfaces/IServer";
import './namespace/Notores';
export declare class NotoresApplication {
    static entities: any[];
    static repositories: any[];
    static _app: NotoresApplication;
    modules: Function[];
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