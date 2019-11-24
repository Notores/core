"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Module {
    constructor() {
        this._initialized = false;
        this._models = {};
    }
    init() {
        this._initialized = true;
    }
    setModel(key, model) {
        this._models[key] = model;
    }
    get models() {
        return this._models;
    }
    get initialized() {
        return this._initialized;
    }
}
exports.default = Module;
module.exports = Module;
