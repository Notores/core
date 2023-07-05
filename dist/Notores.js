import chalk from 'chalk';
import { createNotoresServer } from "./server";
import { bindControllers, isClassType, JSONResponder, SwaggerRegistry, systemLoggerFactory } from "./lib";
import { Notores } from "./types/Notores";
export const SystemLogger = systemLoggerFactory('@notores/core - NotoresApplication');
export class NotoresApplication extends Notores.Application {
    static entities = [];
    static repositories = [];
    static _app = new NotoresApplication();
    static get app() {
        return this._app;
    }
    static async create(modules) {
        modules.forEach((module) => this._app.addModule(module));
        await this._app.setup();
        return this.app;
    }
    modules = [];
    controllers = [];
    responders = [new JSONResponder()];
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
            }
            catch (e) {
            }
        }
        this.buildNotoresApp();
    }
    preBuildNotoresApp() {
        this.apps = createNotoresServer(this);
    }
    buildNotoresApp() {
        this.preBuildNotoresApp();
        this.setup();
    }
    addModule(module) {
        isClassType(module) ?
            this.modules.push(module) :
            this.modules.push(module.default);
        return this;
    }
    setup(options = { logModules: false }) {
        this.bindModules(options);
        return this;
    }
    bindModules({ logModules }) {
        const { ctrls, registeredModules, swaggerOperations } = bindControllers(this);
        this.controllers = ctrls;
        this.registeredModules = registeredModules;
        if (logModules)
            this.logModules(logModules);
        this.swaggerRegistry.paths = swaggerOperations;
        return this;
    }
    #logModule(mod) {
        console.log('');
        console.log(chalk.underline(mod.CLASS.name));
        mod.routes.forEach(({ METHOD, ROUTE, ...route }) => {
            const routes = Array.isArray(ROUTE) ? ROUTE : [ROUTE];
            console.table({
                METHOD,
                ROUTE: routes.length > 1 ? `[ ${routes.join(', ')} ]` : routes[0],
                ...route
            });
        });
        console.log('');
    }
    logModules(options) {
        if (options === true) {
            this.registeredModules.forEach((mod) => this.#logModule(mod));
            return this;
        }
        const filtered = this.registeredModules.filter((mod) => {
            for (const Clazz of options) {
                if (Clazz.name === mod.CLASS.name)
                    return true;
            }
            return false;
        });
        filtered.forEach((mod) => this.#logModule(mod));
        return this;
    }
    start(port = process.env.PORT || 3000) {
        this.server = this.apps.main.listen(port, () => {
            SystemLogger.info(`Server started, listening on port:${port}`);
            if (process.env.NODE_ENV === 'development')
                SystemLogger.info(`Server can be reached on http://localhost:${port}`);
            this.emit('listening');
        });
        return this;
    }
    stop() {
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
            });
        });
    }
}
