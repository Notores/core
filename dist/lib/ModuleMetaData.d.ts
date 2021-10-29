export default class ModuleMetaData {
    private _prefix;
    private _responseIsBody;
    private _filePath;
    private _dataKey?;
    private _entities;
    private _target;
    private _targetName;
    private _key;
    private _entity?;
    private _repository?;
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
}
//# sourceMappingURL=ModuleMetaData.d.ts.map