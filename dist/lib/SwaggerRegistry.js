import { isClassType } from "./classHelpers";
export class SwaggerRegistry {
    entities = [];
    externalDocs;
    info = {
        title: 'API build with Notores',
        version: process.env.npm_package_version || '1.0.0',
    };
    openapi = '3.0.0';
    paths = {};
    security = [];
    servers = [];
    tags = [];
    addServer(server) {
        if (!server.url.startsWith('http')) {
            if (process.env.NODE_ENV === 'development') {
                server.url = `http://${server.url}`;
            }
            else {
                server.url = `https://${server.url}`;
            }
        }
        this.servers.push(server);
    }
    recursiveSanitizeProperties(entity, props = {}) {
        const parentEntity = Object.getPrototypeOf(entity);
        if (isClassType(parentEntity)) {
            const parentProps = this.recursiveSanitizeProperties(parentEntity, props);
            Object.assign(props, parentProps);
        }
        const myProperties = this.entities.find((entityBuilder) => entityBuilder.entity === entity)?.properties;
        if (!myProperties)
            return props;
        Object.assign(props, myProperties);
        return props;
    }
    sanitizeEntities() {
        this.entities = this.entities.map((swagEntityBuilder) => {
            const props = this.recursiveSanitizeProperties(swagEntityBuilder.entity);
            swagEntityBuilder.properties = props;
            return swagEntityBuilder;
        });
        return this;
    }
    toDOC() {
        const { entities, paths, ...doc } = this;
        this.sanitizeEntities();
        let schemas = {};
        entities.forEach((entity) => Object.assign(schemas, entity.toDOC()));
        return {
            ...doc,
            paths,
            components: {
                schemas,
            }
        };
    }
}
