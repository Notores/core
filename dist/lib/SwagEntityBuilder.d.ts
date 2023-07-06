import { OpenAPIV3 } from "openapi-types";
import { ClassType, Notores, NotoresSwagPropData, SwagEntityProperties } from "../types/Notores";
declare type SchemaObject = OpenAPIV3.SchemaObject;
export declare class SwagEntityBuilder implements Notores.SwagEntityBuilder {
    #private;
    constructor(entity: ClassType);
    get required(): string[];
    set required(value: string[]);
    addRequired(property: string): this;
    get properties(): SwagEntityProperties;
    set properties(value: SwagEntityProperties);
    addProperty(key: string, property: NotoresSwagPropData): this;
    addRef(key: string, ref: ClassType): this;
    addArrayRef(key: string, ref: ClassType): this;
    addArrayProperty(key: string, options: SchemaObject): this;
    get name(): string;
    set name(value: string);
    get entity(): ClassType;
    set entity(value: ClassType);
    toDOC(): SchemaObject;
}
export {};
