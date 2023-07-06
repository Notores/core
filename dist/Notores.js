"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _NotoresApplication_instances, _NotoresApplication_logModule;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotoresApplication = exports.SystemLogger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const server_1 = require("./server");
const lib_1 = require("./lib");
const Notores_1 = require("./types/Notores");
exports.SystemLogger = (0, lib_1.systemLoggerFactory)('@notores/core - NotoresApplication');
class NotoresApplication extends Notores_1.Notores.Application {
    constructor() {
        super();
        _NotoresApplication_instances.add(this);
        this.modules = [];
        this.controllers = [];
        this.responders = [new lib_1.JSONResponder()];
        this.swaggerRegistry = new lib_1.SwaggerRegistry();
        this.registeredModules = [];
        this.preBuildNotoresApp();
    }
    static get app() {
        return this._app;
    }
    static create(modules) {
        return __awaiter(this, void 0, void 0, function* () {
            modules.forEach((module) => this._app.addModule(module));
            yield this._app.setup();
            return this.app;
        });
    }
    rebuild() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.server) {
                try {
                    yield this.stop();
                }
                catch (e) {
                }
            }
            this.buildNotoresApp();
        });
    }
    preBuildNotoresApp() {
        this.apps = (0, server_1.createNotoresServer)(this);
    }
    buildNotoresApp() {
        this.preBuildNotoresApp();
        this.setup();
    }
    addModule(module) {
        (0, lib_1.isClassType)(module) ?
            this.modules.push(module) :
            this.modules.push(module.default);
        return this;
    }
    setup(options = { logModules: false }) {
        this.bindModules(options);
        return this;
    }
    bindModules({ logModules }) {
        const { ctrls, registeredModules, swaggerOperations } = (0, lib_1.bindControllers)(this);
        this.controllers = ctrls;
        this.registeredModules = registeredModules;
        if (logModules)
            this.logModules(logModules);
        this.swaggerRegistry.paths = swaggerOperations;
        return this;
    }
    logModules(options) {
        if (options === true) {
            this.registeredModules.forEach((mod) => __classPrivateFieldGet(this, _NotoresApplication_instances, "m", _NotoresApplication_logModule).call(this, mod));
            return this;
        }
        const filtered = this.registeredModules.filter((mod) => {
            for (const Clazz of options) {
                if (Clazz.name === mod.CLASS.name)
                    return true;
            }
            return false;
        });
        filtered.forEach((mod) => __classPrivateFieldGet(this, _NotoresApplication_instances, "m", _NotoresApplication_logModule).call(this, mod));
        return this;
    }
    start(port = process.env.PORT || 3000) {
        this.server = this.apps.main.listen(port, () => {
            exports.SystemLogger.info(`Server started, listening on port:${port}`);
            if (process.env.NODE_ENV === 'development')
                exports.SystemLogger.info(`Server can be reached on http://localhost:${port}`);
            this.emit('listening');
        });
        return this;
    }
    stop() {
        if (!this.server) {
            exports.SystemLogger.error('No server to stop');
        }
        return new Promise((resolve, reject) => {
            this.server.close((error) => {
                if (error) {
                    exports.SystemLogger.error('Could not close server');
                    exports.SystemLogger.error(error);
                    return reject(error);
                }
                this.emit('close');
                resolve();
            });
        });
    }
}
exports.NotoresApplication = NotoresApplication;
_NotoresApplication_instances = new WeakSet(), _NotoresApplication_logModule = function _NotoresApplication_logModule(mod) {
    console.log('');
    console.log(chalk_1.default.underline(mod.CLASS.name));
    mod.routes.forEach((_a) => {
        var { METHOD, ROUTE } = _a, route = __rest(_a, ["METHOD", "ROUTE"]);
        const routes = Array.isArray(ROUTE) ? ROUTE : [ROUTE];
        console.table(Object.assign({ METHOD, ROUTE: routes.length > 1 ? `[ ${routes.join(', ')} ]` : routes[0] }, route));
    });
    console.log('');
};
NotoresApplication.entities = [];
NotoresApplication.repositories = [];
NotoresApplication._app = new NotoresApplication();
