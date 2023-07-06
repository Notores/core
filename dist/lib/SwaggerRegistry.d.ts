import { OpenAPIV3 } from "openapi-types";
import { ClassType, Notores, SwagEntityProperties } from "../types/Notores";
export declare class SwaggerRegistry implements Notores.SwaggerRegistry {
    entities: Array<Notores.SwagEntityBuilder>;
    externalDocs: OpenAPIV3.ExternalDocumentationObject;
    info: OpenAPIV3.InfoObject;
    openapi: string;
    paths: OpenAPIV3.PathsObject;
    security: OpenAPIV3.SecurityRequirementObject[];
    servers: OpenAPIV3.ServerObject[];
    tags: OpenAPIV3.TagObject[];
    addServer(server: OpenAPIV3.ServerObject): void;
    recursiveSanitizeProperties(entity: ClassType, props?: SwagEntityProperties): SwagEntityProperties;
    sanitizeEntities(): this;
    toDOC(): OpenAPIV3.Document;
}
