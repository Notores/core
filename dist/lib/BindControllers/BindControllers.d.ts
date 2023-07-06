import { Notores } from "../../types/Notores";
import { RegisteredModule } from "./types";
import { OpenAPIV3 } from "openapi-types";
export declare function bindControllers(app: Notores.Application): {
    ctrls: object[];
    registeredModules: Array<RegisteredModule>;
    swaggerOperations: OpenAPIV3.PathsObject;
    tag?: OpenAPIV3.TagObject;
};
