import {NotoresApplication} from "../Notores";

export default class ModuleMetaData {

    // Defaults
    private _prefix: string = '/';
    private _responseIsBody: boolean = false;
    private _filePath: string = '';
    private _dataKey?: string | false = false;
    private _entities: any[] = [];

    // Constructor
    private _target!: Function;
    private _targetName!: string;
    private _key!: string;

    // Optionals
    private _entity?: any;
    private _repository?: any;

    constructor(target: Function, filePath: string) {
        this.target = target;
        this.filePath = filePath;
        this.targetName = target.name;
        this.key = this.targetName;
    }

    setup(): void {
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

            NotoresApplication.entities.push(filtered);
        }
        if(this.repository) {
            NotoresApplication.repositories.push(this.repository);
            this.target.prototype.repoClazz = this.repository;
            this.target.prototype.repository = new this.repository();
        }

    }

    private generateDataKeyName() {
        return this.target.name.indexOf('Module') > -1 ? this.target.name.replace('Module', '') : this.target.name;
    }

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._key = value;
    }

    get prefix(): string {
        return this._prefix;
    }

    set prefix(value: string) {
        this._prefix = value.startsWith('/') ? value : `/${value}`;
    }

    get responseIsBody(): boolean {
        return this._responseIsBody;
    }

    set responseIsBody(value: boolean) {
        this._responseIsBody = value;
        this._dataKey = value ? false : this.generateDataKeyName();
    }

    get filePath(): string {
        return this._filePath;
    }

    set filePath(value: string) {
        this._filePath = value;
    }

    get target(): Function {
        return this._target;
    }

    set target(value: Function) {
        this._target = value;
    }

    get repository(): any {
        return this._repository;
    }

    set repository(value: any) {
        this._repository = value;
    }

    get entities(): any[] {
        return this._entities;
    }

    set entities(value: any[]) {
        this._entities = value;
    }

    get entity(): any {
        return this._entity;
    }

    set entity(value: any) {
        this._entity = value;
    }

    get dataKey(): string | false {
        return this.responseIsBody ? false : this._dataKey!;
    }

    set dataKey(value: string | false) {
        this._dataKey = value;
        if (value === false) {
            this._responseIsBody = true;
        }
    }

    get targetName(): string {
        return this._targetName;
    }

    set targetName(value: string) {
        this._targetName = value;
    }
}
