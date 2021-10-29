"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Notores_1 = require("../Notores");
class ModuleMetaData {
    constructor(target, filePath) {
        // Defaults
        this._prefix = '/';
        this._responseIsBody = false;
        this._filePath = '';
        this._dataKey = false;
        this._entities = [];
        this.target = target;
        this.filePath = filePath;
        this.targetName = target.name;
        this.key = this.targetName;
    }
    setup() {
        if (this.entity || this.entities) {
            const arr = [];
            if (this.entity) {
                arr.push(this.entity);
                this.target.prototype.entity = this.entity;
            }
            if (this.entities) {
                arr.push(...this.entities);
                this.target.prototype.entities = this.entities;
            }
            const filtered = [...new Set(arr)];
            Notores_1.NotoresApplication.entities.push(filtered);
        }
        if (this.repository) {
            Notores_1.NotoresApplication.repositories.push(this.repository);
            this.target.prototype.repoClazz = this.repository;
            this.target.prototype.repository = new this.repository();
        }
    }
    generateDataKeyName() {
        return this.target.name.indexOf('Module') > -1 ? this.target.name.replace('Module', '') : this.target.name;
    }
    get key() {
        return this._key;
    }
    set key(value) {
        this._key = value;
    }
    get prefix() {
        return this._prefix;
    }
    set prefix(value) {
        this._prefix = value.startsWith('/') ? value : `/${value}`;
    }
    get responseIsBody() {
        return this._responseIsBody;
    }
    set responseIsBody(value) {
        this._responseIsBody = value;
        this._dataKey = value ? false : this.generateDataKeyName();
    }
    get filePath() {
        return this._filePath;
    }
    set filePath(value) {
        this._filePath = value;
    }
    get target() {
        return this._target;
    }
    set target(value) {
        this._target = value;
    }
    get repository() {
        return this._repository;
    }
    set repository(value) {
        this._repository = value;
    }
    get entities() {
        return this._entities;
    }
    set entities(value) {
        this._entities = value;
    }
    get entity() {
        return this._entity;
    }
    set entity(value) {
        this._entity = value;
    }
    get dataKey() {
        return this.responseIsBody ? false : this._dataKey;
    }
    set dataKey(value) {
        this._dataKey = value;
        if (value === false) {
            this._responseIsBody = true;
        }
    }
    get targetName() {
        return this._targetName;
    }
    set targetName(value) {
        this._targetName = value;
    }
}
exports.default = ModuleMetaData;
