import MongoSchema from "../MongoSchema/MongoSchema";

export default class Module {

    private _initialized : boolean = false;
    private _models : { [key: string]: MongoSchema<any>} = {};

    init() {
        this._initialized = true;
    }

    setModel(key:string, model: MongoSchema<any>) {
        this._models[key] = model;
    }

    get models() {
        return this._models;
    }

    get initialized() {
        return this._initialized;
    }
}

module.exports = Module;
