"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotoresApplication = void 0;
const helpers_1 = require("./decorators/helpers");
const server_1 = require("./server");
require("./namespace/Notores");
const logger_1 = __importDefault(require("./lib/logger"));
const logger = logger_1.default(module);
let NotoresApplication = /** @class */ (() => {
    class NotoresApplication {
        constructor(modules) {
            this.modules = [
                require('./modules/HTTP-LOG').default,
            ];
            this.controllers = [];
            this.apps = server_1.createServer();
            this.modules.push(...modules);
        }
        static get app() {
            return this._app;
        }
        static async create(modules) {
            if (this.app) {
                return this.app;
            }
            else {
                this._app = new NotoresApplication(modules);
                await this._app.setup();
                return this.app;
            }
        }
        async setup() {
            this.bindModules();
        }
        bindModules() {
            this.controllers = helpers_1.bindControllers(this.apps, this.modules);
            console.table(helpers_1.paths);
        }
        addConnectionToRequest() {
            this.apps.system.use((req, res, next) => {
                req.db = {
                    connection: this.connection,
                    type: this.db || 'Not defined',
                    error: null
                };
                next();
            });
        }
        start(port = process.env.PORT) {
            if (!port)
                port = 3000;
            this.apps.main.listen(port, () => {
                logger.info(`Server started, listening on port:${port}`);
                if (process.env.NODE_ENV === 'development')
                    logger.info(`Server can be reached on http://localhost:${port}`);
            });
        }
    }
    NotoresApplication.entities = [];
    NotoresApplication.repositories = [];
    return NotoresApplication;
})();
exports.NotoresApplication = NotoresApplication;
