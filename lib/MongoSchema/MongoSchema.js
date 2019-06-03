const mongoose = require('mongoose');

class MongoSchema extends mongoose.Schema {

    #model;

    whitelist = {
        get: [],
    };

    constructor(modelName, schema, options, loadModel = false) {
        super(schema, options);

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
        mongoose.deleteModel(this.modelName);
        this.#model = null;
    }

    loadModel() {
        if (this.#model) {
            throw new Error(`Model ${this.modelName} is already loaded. Please use "reloadModel" instead`)
        }
        this.#model = mongoose.model(this.modelName, this);
    }

    get model() {
        return this.#model;
    }

    reloadModel() {
        if (this.#model)
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

module.exports = MongoSchema;
