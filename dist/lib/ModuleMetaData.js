import { NotoresApplication } from "../Notores";
export class ModuleMetaData {
    // Defaults
    #prefix = '/';
    #responseIsBody = false;
    #filePath = '';
    #dataKey = false;
    #entities = [];
    // Constructor
    #target;
    #targetName;
    #key;
    #swaggerTag;
    // Optionals
    #entity;
    #repository;
    constructor(target, filePath) {
        this.#target = target;
        this.#filePath = filePath;
        this.#targetName = target.name;
        this.#key = this.targetName;
        this.#swaggerTag = {
            name: target.name.replace(/(Module|module)/, ''),
        };
    }
    setup() {
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
        if (this.repository) {
            NotoresApplication.repositories.push(this.#repository);
            this.#target.prototype.repoClazz = this.#repository;
            this.#target.prototype.repository = new this.#repository();
        }
    }
    generateDataKeyName() {
        return this.#target.name.indexOf('Module') > -1 ? this.#target.name.replace('Module', '') : this.#target.name;
    }
    get key() {
        return this.#key;
    }
    set key(value) {
        this.#key = value;
    }
    get prefix() {
        return this.#prefix;
    }
    set prefix(value) {
        this.#prefix = value.startsWith('/') ? value : `/${value}`;
    }
    get responseIsBody() {
        return this.#responseIsBody;
    }
    set responseIsBody(value) {
        this.#responseIsBody = value;
        this.#dataKey = value ? false : this.generateDataKeyName();
    }
    get filePath() {
        return this.#filePath;
    }
    set filePath(value) {
        this.#filePath = value;
    }
    get target() {
        return this.#target;
    }
    set target(value) {
        this.#target = value;
    }
    get repository() {
        return this.#repository;
    }
    set repository(value) {
        this.#repository = value;
    }
    get entities() {
        return this.#entities;
    }
    set entities(value) {
        this.#entities = value;
    }
    get entity() {
        return this.#entity;
    }
    set entity(value) {
        this.#entity = value;
    }
    get dataKey() {
        return this.#responseIsBody ? false : this.#dataKey;
    }
    set dataKey(value) {
        this.#dataKey = value;
        if (value === false) {
            this.#responseIsBody = true;
        }
    }
    get targetName() {
        return this.#targetName;
    }
    set targetName(value) {
        this.#targetName = value;
    }
    get swaggerTag() {
        return this.#swaggerTag;
    }
    set swaggerTag(tag) {
        this.#swaggerTag = tag;
    }
}
