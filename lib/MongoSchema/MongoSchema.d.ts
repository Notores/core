import { Document, SchemaDefinition, SchemaOptions } from "mongoose";
import { StringKeyObject } from "../../Types";
import mongoose from "mongoose";
export default class MongooseSchema<T extends Document> extends mongoose.Schema implements StringKeyObject {
    private _model;
    private readonly modelName;
    whitelist: StringKeyObject;
    constructor(modelName: string, schema: SchemaDefinition, options?: SchemaOptions, loadModel?: boolean);
    extendSchema(schema: mongoose.Schema): void;
    deleteModel(): void;
    loadModel(): void;
    readonly model: any;
    reloadModel(): void;
    updateWhitelist(listType: string, fields: Array<string> | string, add?: boolean): void;
}
//# sourceMappingURL=MongoSchema.d.ts.map