"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class MongooseSchema extends mongoose_1.default.Schema {
    constructor(modelName, schema, options, loadModel = false) {
        super(schema, options);
        this.whitelist = {
            get: [],
        };
        // this.schema = schema;
        this.modelName = modelName;
        if (loadModel)
            this.loadModel();
    }
    extendSchema(schema) {
        super.add(schema);
        //SUPER important!! Otherwise calling added properties will only work with .get(prop);
        for (let key in schema.obj) {
            this.obj[key] = schema.obj[key];
        }
    }
    deleteModel() {
        //probably needs to happen on the connection object
        // @ts-ignore
        mongoose_1.default.deleteModel(this.modelName);
        this._model = undefined;
    }
    loadModel() {
        if (this._model) {
            throw new Error(`Model ${this.modelName} is already loaded. Please use "reloadModel" instead`);
        }
        this._model = mongoose_1.default.model(this.modelName, this);
    }
    get model() {
        return this._model;
    }
    reloadModel() {
        if (this._model)
            this.deleteModel();
        this.loadModel();
    }
    updateWhitelist(listType, fields, add = true) {
        if (!Array.isArray(fields)) {
            fields = [fields];
        }
        if (add) {
            if (!this.whitelist.hasOwnProperty(listType))
                this.whitelist[listType] = [];
            this.whitelist[listType].push(...fields);
        }
        else {
            fields.forEach(field => {
                while (this.whitelist[listType].includes(field)) {
                    this.whitelist[listType].splice(this.whitelist[listType].indexOf(field), 1);
                }
            });
        }
    }
}
exports.default = MongooseSchema;
module.exports = MongooseSchema;
