import { mongoose } from "@typegoose/typegoose";
import { Mongoose } from "mongoose";
import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import { NotoresModelType } from "../../../../../temp/typegoose/src/types/NotoresModelType";
interface IMongoConfigInput {
    user: string;
    password: string;
    host: string;
    port: string | number;
    database: string;
    authSource?: string;
}
export declare function generateConnectionString(config?: IMongoConfigInput, options?: object): string;
export declare function connect(connectionString?: string): Promise<Mongoose | Error>;
export declare function getConnected(): {
    state: any;
    readableState: any;
};
export declare function getDatabase(): any;
export declare function notoresModelForClass<T, U extends AnyParamConstructor<T>>(clazz: U): NotoresModelType<U, T>;
export declare function notoresAddModelToTypegoose<T, U extends AnyParamConstructor<T>>(model: mongoose.Model<any>, cl: U, oldModel: NotoresModelType<U>): NotoresModelType<U, T>;
export {};
//# sourceMappingURL=mongodb.d.ts.map