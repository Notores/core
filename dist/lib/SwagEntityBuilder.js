import { generateRefObject } from "./SwaggerHelpers";
export class SwagEntityBuilder {
    #entity;
    #name;
    #properties = {};
    #required = [];
    constructor(entity) {
        this.#entity = entity;
        this.#name = entity.name;
    }
    get required() {
        return this.#required;
    }
    set required(value) {
        this.#required = value;
    }
    addRequired(property) {
        this.#required.push(property);
        return this;
    }
    get properties() {
        return this.#properties;
    }
    set properties(value) {
        this.#properties = value;
    }
    addProperty(key, property) {
        Object.assign(this.#properties, { [key]: property });
        return this;
    }
    addRef(key, ref) {
        Object.assign(this.#properties, { [key]: generateRefObject(ref) });
        return this;
    }
    addArrayRef(key, ref) {
        Object.assign(this.#properties, {
            [key]: {
                type: 'array',
                items: generateRefObject(ref)
            }
        });
        return this;
    }
    addArrayProperty(key, options) {
        Object.assign(this.#properties, {
            [key]: {
                type: 'array',
                items: options
            }
        });
        return this;
    }
    get name() {
        return this.#name;
    }
    set name(value) {
        this.#name = value;
    }
    get entity() {
        return this.#entity;
    }
    set entity(value) {
        this.#entity = value;
    }
    toDOC() {
        return {
            [this.#name]: {
                type: "object",
                required: this.#required,
                properties: this.#properties
            }
        };
    }
}
