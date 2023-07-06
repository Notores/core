"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerRegistry = void 0;
const classHelpers_1 = require("./classHelpers");
class SwaggerRegistry {
    constructor() {
        this.entities = [];
        this.info = {
            title: 'API build with Notores',
            version: process.env.npm_package_version || '1.0.0',
        };
        this.openapi = '3.0.0';
        this.paths = {};
        this.security = [];
        this.servers = [];
        this.tags = [];
    }
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
        var _a;
        const parentEntity = Object.getPrototypeOf(entity);
        if ((0, classHelpers_1.isClassType)(parentEntity)) {
            const parentProps = this.recursiveSanitizeProperties(parentEntity, props);
            Object.assign(props, parentProps);
        }
        const myProperties = (_a = this.entities.find((entityBuilder) => entityBuilder.entity === entity)) === null || _a === void 0 ? void 0 : _a.properties;
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
        const _a = this, { entities, paths } = _a, doc = __rest(_a, ["entities", "paths"]);
        this.sanitizeEntities();
        let schemas = {};
        entities.forEach((entity) => Object.assign(schemas, entity.toDOC()));
        return Object.assign(Object.assign({}, doc), { paths, components: {
                schemas,
            } });
    }
}
exports.SwaggerRegistry = SwaggerRegistry;
