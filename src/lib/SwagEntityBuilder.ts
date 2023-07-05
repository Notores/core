import {OpenAPIV3} from "openapi-types";
import {ClassType, Notores, NotoresSwagPropData, SwagEntityProperties} from "../types/Notores";
import {generateRefObject} from "./SwaggerHelpers";

type SchemaObject = OpenAPIV3.SchemaObject;

export class SwagEntityBuilder implements Notores.SwagEntityBuilder {
    #entity: ClassType;
    #name: string;
    #properties: SwagEntityProperties = {};
    #required: string[] = [];

    constructor(entity: ClassType) {
        this.#entity = entity;
        this.#name = entity.name;
    }

    get required(): string[] {
        return this.#required;
    }

    set required(value: string[]) {
        this.#required = value;
    }

    addRequired(property: string) {
        this.#required.push(property);
        return this;
    }

    get properties(): SwagEntityProperties {
        return this.#properties;
    }

    set properties(value: SwagEntityProperties) {
        this.#properties = value;
    }

    addProperty(key: string, property: NotoresSwagPropData): this {
        Object.assign(this.#properties, {[key]: property});
        return this;
    }

    addRef(key: string, ref: ClassType): this {
        Object.assign(this.#properties, {[key]: generateRefObject(ref)});
        return this;
    }

    addArrayRef(key: string, ref: ClassType): this {
        Object.assign(this.#properties, {
            [key]: {
                type: 'array',
                items: generateRefObject(ref)
            }
        });
        return this;
    }

    addArrayProperty(key: string, options: SchemaObject): this {
        Object.assign(this.#properties, {
            [key]: {
                type: 'array',
                items: options
            }
        });
        return this;
    }

    get name(): string {
        return this.#name;
    }

    set name(value: string) {
        this.#name = value;
    }

    get entity(): ClassType {
        return this.#entity;
    }

    set entity(value: ClassType) {
        this.#entity = value;
    }

    toDOC(): SchemaObject {
        return {
            [this.#name]: {
                type: "object",
                required: this.#required,
                properties: this.#properties
            }
        }
    }

}