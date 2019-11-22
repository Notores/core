import mongoose, {Model, Document, SchemaDefinition, SchemaOptions} from "mongoose";

declare class MongoSchema<T extends Document> extends mongoose.Schema {
    model: Model<T>;
    constructor(name: string, definition: SchemaDefinition, options?: SchemaOptions);
    loadModel(): void;
    modelName: string;
}
