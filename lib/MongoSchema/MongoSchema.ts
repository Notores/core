import {Document, Model, SchemaDefinition, SchemaOptions} from "mongoose";
import {StringKeyObject} from "../../Types";
import mongoose from "mongoose";

export default class MongooseSchema<T extends Document> extends mongoose.Schema implements StringKeyObject {

    private _model : Model<T>|undefined;
    private readonly modelName: string;
    public whitelist : StringKeyObject;

    constructor(modelName : string, schema: SchemaDefinition, options? : SchemaOptions, loadModel : boolean = false) {
        super(schema, options);

        this.whitelist = {
            get: [],
        };
        // this.schema = schema;
        this.modelName = modelName;

        if (loadModel)
            this.loadModel();
    }

    extendSchema(schema : mongoose.Schema) {
        super.add(schema);
        //SUPER important!! Otherwise calling added properties will only work with .get(prop);
        for (let key in schema.obj) {
            (this as StringKeyObject).obj[key] = schema.obj[key];
        }
    }

    deleteModel() {
        //probably needs to happen on the connection object
        // @ts-ignore
        mongoose.deleteModel(this.modelName);
        this._model = undefined;
    }

    loadModel() {
        if (this._model) {
            throw new Error(`Model ${this.modelName} is already loaded. Please use "reloadModel" instead`)
        }
        this._model = mongoose.model(this.modelName, this);
    }

    get model() {
        return this._model;
    }

    reloadModel() {
        if (this._model)
            this.deleteModel();
        this.loadModel();
    }

    updateWhitelist(listType:string, fields : Array<string>|string, add = true) {
        if (!Array.isArray(fields)) {
            fields = [fields];
        }

        if (add) {
            if (!this.whitelist.hasOwnProperty(listType))
                this.whitelist[listType] = [];

            this.whitelist[listType].push(
                ...fields
            )
        } else {
            fields.forEach(field => {
                while (this.whitelist[listType].includes(field)) {
                    this.whitelist[listType].splice(this.whitelist[listType].indexOf(field), 1);
                }
            });
        }
    }
}

module.exports = MongooseSchema;
