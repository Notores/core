import {OpenAPIV3} from "openapi-types";
import {ClassType, Notores, SwagEntityProperties} from "../types/Notores";
import {isClassType} from "./classHelpers";

export class SwaggerRegistry implements Notores.SwaggerRegistry {
    entities: Array<Notores.SwagEntityBuilder> = [];
    externalDocs: OpenAPIV3.ExternalDocumentationObject;
    info: OpenAPIV3.InfoObject = {
        title: 'API build with Notores',
        version: process.env.npm_package_version || '1.0.0',
    };
    openapi: string = '3.0.0';
    paths: OpenAPIV3.PathsObject = {};
    security: OpenAPIV3.SecurityRequirementObject[] = [];
    servers: OpenAPIV3.ServerObject[] = [];
    tags: OpenAPIV3.TagObject[] = [];

    addServer(server: OpenAPIV3.ServerObject) {
        if (!server.url.startsWith('http')) {
            if (process.env.NODE_ENV === 'development') {
                server.url = `http://${server.url}`;
            } else {
                server.url = `https://${server.url}`;
            }
        }

        this.servers.push(server);
    }

    recursiveSanitizeProperties(entity: ClassType, props: SwagEntityProperties = {}) {
        const parentEntity = Object.getPrototypeOf(entity)
        if (isClassType(parentEntity)) {
            const parentProps = this.recursiveSanitizeProperties(parentEntity, props)
            Object.assign(props, parentProps);
        }

        const myProperties = this.entities.find(
            (entityBuilder: Notores.SwagEntityBuilder) => entityBuilder.entity === entity
        )?.properties

        if (!myProperties) return props;

        Object.assign(props, myProperties);

        return props;
    }

    sanitizeEntities() {
        this.entities = this.entities.map((swagEntityBuilder: Notores.SwagEntityBuilder) => {
            const props: SwagEntityProperties = this.recursiveSanitizeProperties(swagEntityBuilder.entity);
            swagEntityBuilder.properties = props;
            return swagEntityBuilder;
        })
        return this;
    }

    toDOC(): OpenAPIV3.Document {
        const {entities, paths, ...doc} = this;

        this.sanitizeEntities();

        let schemas = {};
        entities.forEach((entity: Notores.SwagEntityBuilder) => Object.assign(schemas, entity.toDOC()));

        return {
            ...doc,
            paths,
            components: {
                schemas,
            }
        }
    }
}