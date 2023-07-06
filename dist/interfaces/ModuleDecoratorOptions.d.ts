import { OpenAPIV3 } from "openapi-types";
export interface ModuleDecoratorOptions {
    key?: string;
    prefix?: string;
    dataKey?: string;
    responseAsBody?: boolean;
    entity?: any;
    entities?: any[];
    repository?: any;
    swaggerTag?: OpenAPIV3.TagObject | false;
}
