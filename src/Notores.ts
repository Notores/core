import chalk from 'chalk';
import {createNotoresServer} from "./server";
import {
    bindControllers,
    isClassType,
    JSONResponder,
    MainResponder,
    RegisteredModule, RegisteredRoute,
    SwaggerRegistry,
    systemLoggerFactory
} from "./lib";
import {ClassType, Mod, Notores} from "./types/Notores";

export const SystemLogger = systemLoggerFactory('@notores/core - NotoresApplication');

export class NotoresApplication extends Notores.Application {

    static entities: any[] = [];
    static repositories: any[] = [];
    static _app: NotoresApplication = new NotoresApplication();

    static get app(): NotoresApplication | null {
        return this._app;
    }

    static async create(modules: Mod[]) {
        modules.forEach((module: Mod) => this._app.addModule(module))
        await this._app.setup();
        return this.app;
    }

    modules: Array<ClassType> = [];
    controllers: any[] = [];
    responders: MainResponder[] = [new JSONResponder()];
    swaggerRegistry = new SwaggerRegistry();
    registeredModules = [];

    constructor() {
        super();
        this.preBuildNotoresApp();
    }

    async rebuild() {
        if (this.server) {
            try {
                await this.stop();
            } catch (e) {

            }
        }
        this.buildNotoresApp();
    }

    private preBuildNotoresApp() {
        this.apps = createNotoresServer(this);
    }

    private buildNotoresApp() {
        this.preBuildNotoresApp()
        this.setup();
    }

    addModule(module: Mod) {
        isClassType(module) ?
            this.modules.push(module) :
            this.modules.push(module.default);
        return this;
    }

    setup(options: Notores.ApplicationSetup = {logModules: false}) {
        this.bindModules(options);
        return this;
    }

    bindModules({logModules}: Notores.ApplicationSetup) {
        const {ctrls, registeredModules, swaggerOperations} = bindControllers(this);
        this.controllers = ctrls;
        this.registeredModules = registeredModules;
        if (logModules) this.logModules(logModules);
        this.swaggerRegistry.paths = swaggerOperations;
        return this;
    }

    #logModule(mod: RegisteredModule) {
        console.log('')
        console.log(chalk.underline(mod.CLASS.name));
        mod.routes.forEach(({METHOD, ROUTE, ...route}: RegisteredRoute) => {
            const routes = Array.isArray(ROUTE) ? ROUTE : [ROUTE];
            console.table({
                METHOD,
                ROUTE: routes.length > 1 ? `[ ${routes.join(', ')} ]` : routes[0],
                ...route
            });
        })
        console.log('')
    }

    logModules(options: true | ClassType[]) {
        if (options === true) {
            this.registeredModules.forEach((mod: RegisteredModule) => this.#logModule(mod))
            return this;
        }
        const filtered = this.registeredModules.filter((mod: RegisteredModule) => {
            for (const Clazz of options) {
                if (Clazz.name === mod.CLASS.name) return true;
            }
            return false;
        })
        filtered.forEach((mod: RegisteredModule) => this.#logModule(mod));
        return this;
    }

    start(port: Number | String | undefined = process.env.PORT || 3000) {
        this.server = this.apps.main.listen(port, () => {
            SystemLogger.info(`Server started, listening on port:${port}`);
            if (process.env.NODE_ENV === 'development')
                SystemLogger.info(`Server can be reached on http://localhost:${port}`);
            this.emit('listening')
        });
        return this;
    }

    stop(): Promise<void> {
        if (!this.server) {
            SystemLogger.error('No server to stop');
        }

        return new Promise((resolve, reject) => {
            this.server.close((error) => {
                if (error) {
                    SystemLogger.error('Could not close server');
                    SystemLogger.error(error);
                    return reject(error);
                }
                this.emit('close');
                resolve();
            })
        })
    }
}