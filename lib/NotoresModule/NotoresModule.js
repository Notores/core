class Module {

    #initialized = false;
    #models = {};

    init() {
        this.#initialized = true;
    }

    setModel(key, model) {
        this.#models[key] = model;
    }

    get models() {
        return this.#models;
    }

    get initialized() {
        return this.#initialized;
    }
}

module.exports = Module;