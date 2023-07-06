import { OpenAPIV3 } from "openapi-types";
export declare class ModuleMetaData {
    #private;
    constructor(target: Function, filePath: string);
    setup(): void;
    private generateDataKeyName;
    get key(): string;
    set key(value: string);
    get prefix(): string;
    set prefix(value: string);
    get responseIsBody(): boolean;
    set responseIsBody(value: boolean);
    get filePath(): string;
    set filePath(value: string);
    get target(): Function;
    set target(value: Function);
    get repository(): any;
    set repository(value: any);
    get entities(): any[];
    set entities(value: any[]);
    get entity(): any;
    set entity(value: any);
    get dataKey(): string | false;
    set dataKey(value: string | false);
    get targetName(): string;
    set targetName(value: string);
    get swaggerTag(): OpenAPIV3.TagObject;
    set swaggerTag(tag: OpenAPIV3.TagObject);
}
