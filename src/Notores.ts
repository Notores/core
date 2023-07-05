import {bindControllers, paths} from "./decorators/helpers";
import {createServer} from "./server";
import {IServer} from "./interfaces/IServer";
import './namespace/Notores';
import {systemLoggerFactory} from './lib/logger';
import {NextFunction, Request, Response} from "express";

export const SystemLogger = systemLoggerFactory('@notores/core');

export class NotoresApplication {

    static entities: any[] = [];
    static repositories: any[] = [];

    static _app: NotoresApplication;

    modules: Array<{ default: Function } | Function> = [
        require('./modules/HTTP-LOG'),
    ];
    controllers: any[] = [];
    apps: IServer = createServer();
    connection: any;
    db?: string;

    static get app(): NotoresApplication {
        return this._app;
    }

    static async create(modules: Function[]) {
        if (this.app) {
            return this.app;
        } else {
            this._app = new NotoresApplication(modules);
            await this._app.setup();
            return this.app;
        }
    }

    constructor(modules: Function[]) {
        this.modules.push(...modules);
    }

    async setup() {
        this.bindModules();
    }

    bindModules() {
        this.controllers = bindControllers(this.apps, this.modules.map(m => typeof m === 'function' ? m : m.default));
        console.table(paths);
    }

    addConnectionToRequest() {
        this.apps.system.use((req: Request, res: Response, next: NextFunction) => {
            req.db = {
                connection: this.connection,
                type: this.db || 'Not defined',
                error: null
            };
            next();
        });
    }

    start(port: Number | String | undefined = process.env.PORT): void {
        if (!port)
            port = 3000;


        this.apps.main.listen(port, () => {
            SystemLogger.info(`Server started, listening on port:${port}`);
            if (process.env.NODE_ENV === 'development')
                SystemLogger.info(`Server can be reached on http://localhost:${port}`);
        })
    }
}
