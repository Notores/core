import MongoSchema from "../MongoSchema/MongoSchema";
export default class Module {
    private _initialized;
    private _models;
    init(): void;
    setModel(key: string, model: MongoSchema<any>): void;
    readonly models: {
        [key: string]: MongoSchema<any>;
    };
    readonly initialized: boolean;
}
//# sourceMappingURL=NotoresModule.d.ts.map