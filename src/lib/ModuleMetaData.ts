import {NotoresApplication} from "../Notores";
import {OpenAPIV3} from "openapi-types";

export class ModuleMetaData {

    // Defaults
    #prefix: string = '/';
    #responseIsBody: boolean = false;
    #filePath: string = '';
    #dataKey?: string | false = false;
    #entities: any[] = [];
    // Constructor
    #target!: Function;
    #targetName!: string;
    #key!: string;
    #swaggerTag: OpenAPIV3.TagObject;

    // Optionals
    #entity?: any;
    #repository?: any;

    constructor(target: Function, filePath: string) {
        this.#target = target;
        this.#filePath = filePath;
        this.#targetName = target.name;
        this.#key = this.targetName;
        this.#swaggerTag = {
            name: target.name.replace(/(Module|module)/, ''),
        }
    }

    setup(): void {
        if (this.#entity || this.#entities) {
            const arr = [];
            if (this.#entity) {
                arr.push(this.#entity);
                this.#target.prototype.entity = this.#entity;
            }

            if (this.#entities) {
                arr.push(...this.#entities);
                this.#target.prototype.entities = this.#entities;
            }

            const filtered = [...new Set(arr)];

            NotoresApplication.entities.push(filtered);
        }
        if(this.repository) {
            NotoresApplication.repositories.push(this.#repository);
            this.#target.prototype.repoClazz = this.#repository;
            this.#target.prototype.repository = new this.#repository();
        }

    }

    private generateDataKeyName() {
        return this.#target.name.indexOf('Module') > -1 ? this.#target.name.replace('Module', '') : this.#target.name;
    }

    get key(): string {
        return this.#key;
    }

    set key(value: string) {
        this.#key = value;
    }

    get prefix(): string {
        return this.#prefix;
    }

    set prefix(value: string) {
        this.#prefix = value.startsWith('/') ? value : `/${value}`;
    }

    get responseIsBody(): boolean {
        return this.#responseIsBody;
    }

    set responseIsBody(value: boolean) {
        this.#responseIsBody = value;
        this.#dataKey = value ? false : this.generateDataKeyName();
    }

    get filePath(): string {
        return this.#filePath;
    }

    set filePath(value: string) {
        this.#filePath = value;
    }

    get target(): Function {
        return this.#target;
    }

    set target(value: Function) {
        this.#target = value;
    }

    get repository(): any {
        return this.#repository;
    }

    set repository(value: any) {
        this.#repository = value;
    }

    get entities(): any[] {
        return this.#entities;
    }

    set entities(value: any[]) {
        this.#entities = value;
    }

    get entity(): any {
        return this.#entity;
    }

    set entity(value: any) {
        this.#entity = value;
    }

    get dataKey(): string | false {
        return this.#responseIsBody ? false : this.#dataKey!;
    }

    set dataKey(value: string | false) {
        this.#dataKey = value;
        if (value === false) {
            this.#responseIsBody = true;
        }
    }

    get targetName(): string {
        return this.#targetName;
    }

    set targetName(value: string) {
        this.#targetName = value;
    }

    get swaggerTag(): OpenAPIV3.TagObject {
        return this.#swaggerTag;
    }

    set swaggerTag(tag: OpenAPIV3.TagObject) {
        this.#swaggerTag = tag;
    }
}
