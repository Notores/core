import { MongoSchema } from "../MongoSchema";

declare class NotoresModule {
    init(): void;
    setModel(key:string, model: MongoSchema<any>): void;
    models: { [key: string]: MongoSchema<any>};
    initialized: boolean
}
