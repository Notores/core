/// <reference types="node" />
/// <reference types="node" />
import http from 'http';
import { SessionObject } from "../interfaces";
import express, { Request, Response } from "express";
import { Query } from "express-serve-static-core";
import EventEmitter from 'node:events';
import { OpenAPIV3 } from "openapi-types";
import { RegisteredModule } from "../lib";
export declare type ClassType = {
    new (): Object;
};
export declare type DefaultClassExport = {
    default: ClassType;
};
export declare type Mod = DefaultClassExport | ClassType;
declare type SchemaObject = OpenAPIV3.SchemaObject;
declare type BaseSchemaObject = OpenAPIV3.BaseSchemaObject;
declare type NonArraySchemaObjectType = OpenAPIV3.NonArraySchemaObjectType;
declare type NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;
export declare type NotoresSwagPropData = OpenAPIV3.ArraySchemaObject | Notores.SwagPropRefOptions | Notores.SwagPropRefArrayOptions | Notores.SwagPropOptions | Notores.SwagPropArrayOptions;
export declare type SwagEntityProperties = {
    [key: string]: NonArraySchemaObject;
};
export declare type ApiPath = string | RegExp;
export declare type ApiMethodPath = Array<ApiPath> | ApiPath;
export declare type ApiMethodStringPath = Array<string> | string;
export declare type TargetReturnType = (target: any, propertyKey: any) => void;
export declare type PrimitiveNonArrayType = Exclude<OpenAPIV3.NonArraySchemaObjectType, 'object'>;
export interface PathOptions {
    swagger?: boolean;
}
export declare type CombinedPathOptions = PathOptions & {
    path: ApiPath;
};
declare module 'express' {
    interface Request {
        user: Notores.User;
        config: Notores.Config;
        notores: Notores.Application;
        session: SessionObject;
        isAuthenticated: () => boolean;
    }
    interface Response {
        locals: Notores.Locals;
    }
    interface User extends Notores.User {
    }
}
export declare namespace Notores {
    interface ApplicationSetup {
        logModules: boolean | ClassType[];
    }
    abstract class Responder {
        _type: string;
        abstract get type(): string;
        abstract set type(type: string);
        abstract responder(req: Request, res: Response): void;
    }
    interface User {
        roles: Array<string | {
            role: string;
            [key: string]: any;
        } | any>;
        verifyPassword(input: string): Promise<{
            message: string;
        } | Error>;
        updatePassword(oldPass: string, newPass: string): Promise<{
            message: string;
        } | Error>;
    }
    interface Config {
        authentication: {
            enabled: boolean;
            saltRounds: number;
        };
        jwt: {
            secretOrKey: string;
            issuer: string;
            audience: string;
        };
        server: {
            accepts: string[];
            contentType: string[];
            requestSizeLimit: string;
        };
        cookie: {
            name?: string;
            key?: string;
            secret?: string;
            useCookie: boolean;
            duration?: number;
            activeDuration?: number;
            httpOnly?: boolean;
        };
        swagger: Record<string, any>;
    }
    interface SwaggerRegistry extends Pick<OpenAPIV3.Document, 'openapi' | 'info' | 'servers' | 'security' | 'tags' | 'externalDocs'> {
        paths: OpenAPIV3.PathsObject;
        entities: Array<Notores.SwagEntityBuilder>;
        sanitizeEntities: () => this;
        toDOC: () => OpenAPIV3.Document;
    }
    abstract class Application extends EventEmitter {
        static entities: any[];
        static repositories: any[];
        static _app: Notores.Application;
        static get app(): Notores.Application;
        static create(modules: Mod[]): Promise<Notores.Application>;
        swaggerRegistry: Notores.SwaggerRegistry;
        modules: Array<ClassType>;
        controllers: any[];
        apps: Notores.Server;
        server: http.Server | null;
        connection: any;
        db?: string;
        responders: Notores.Responder[];
        registeredModules: Array<RegisteredModule>;
        abstract setup(options: Notores.ApplicationSetup): this;
        abstract addModule(module: Mod): this;
        abstract bindModules(options: Notores.ApplicationSetup): this;
        abstract logModules(options: true | ClassType[]): this;
        abstract rebuild(): Promise<void>;
        abstract start(port: Number | String | undefined): this;
        abstract stop(): Promise<void>;
    }
    abstract class Locals {
        _contentType: string[];
        _body: Record<string, any>;
        _payload: Record<string, any>;
        _url: string;
        _path: string;
        _config: Notores.Config;
        _user: Notores.User | null;
        _query: Query;
        _accepts: string[];
        _error: Error | null;
        _statusCode: number;
        _authenticated: boolean;
        _NODE_ENV: string;
        _req: Request;
        _res: Response;
        abstract setBody<T extends Record<string, any>>(body: T, overwrite?: boolean): T;
        abstract bodyPropertyIsSet(property?: string): boolean;
        abstract get body(): Record<string, any>;
        abstract get contentType(): string[];
        abstract set contentType(contentType: string[]);
        abstract addContentType(contentType: string | string[]): string[];
        abstract get accepts(): string[];
        abstract set accepts(accepts: string[]);
        abstract addAccepts(accepts: string | string[]): string[];
        abstract get config(): Notores.Config;
        abstract get user(): Notores.User | null;
        abstract get query(): Query;
        abstract get error(): Error;
        abstract set error(error: Error);
        abstract get statusCode(): number;
        abstract set statusCode(statusCode: number);
        abstract get hasError(): boolean;
        abstract get payload(): Record<string, any>;
        abstract get url(): string;
        abstract get path(): string;
        abstract toJSON(): Record<string, any>;
    }
    interface Server {
        main: express.Express;
        system: express.Router;
        auth: express.Router;
        preMiddleware: express.Router;
        public: {
            main: express.Router;
            preMiddleware: express.Router;
            router: express.Router;
            postMiddleware: express.Router;
            responders: express.Router;
        };
        restricted: {
            main: express.Router;
            preMiddleware: express.Router;
            router: express.Router;
            postMiddleware: express.Router;
            responders: express.Router;
        };
        errorResponders: express.Router;
    }
    interface SwagEntityBuilder {
        name: string;
        entity: ClassType;
        required: string[];
        properties: SwagEntityProperties;
        addRequired(property: string): this;
        addProperty(key: string, property: Notores.SwagPropOptions): this;
        addProperty(key: string, property: Notores.SwagPropRefOptions): this;
        addProperty(key: string, property: Notores.SwagPropArrayOptions): this;
        addProperty(key: string, property: Notores.SwagPropRefArrayOptions): this;
        addProperty(key: string, property: OpenAPIV3.ArraySchemaObject): this;
        addArrayRef(key: string, ref: ClassType): this;
        addArrayProperty(key: string, options: OpenAPIV3.SchemaObject): this;
        addRef(key: string, ref: ClassType): this;
        toDOC(): SchemaObject;
    }
    interface SwagClassOptions extends BaseSchemaObject {
    }
    interface SwagPropArrayOptions extends Omit<BaseSchemaObject, 'required'> {
        required?: boolean;
    }
    interface SwagPropRefArrayOptions extends Omit<BaseSchemaObject, 'required'> {
        required?: boolean;
    }
    interface SwagPropOptions extends Pick<NonArraySchemaObject, 'description' | 'format' | 'default' | 'multipleOf' | 'maximum' | 'exclusiveMaximum' | 'minimum' | 'exclusiveMinimum' | 'maxLength' | 'minLength' | 'pattern' | 'additionalProperties' | 'maxItems' | 'minItems' | 'uniqueItems' | 'maxProperties' | 'minProperties' | 'properties' | 'anyOf' | 'allOf'> {
        required?: boolean;
        type?: NonArraySchemaObjectType;
        enum?: Object | Array<number | string>;
    }
    interface SwagPropRefOptions {
        type: ClassType;
        required?: boolean;
    }
}
export {};
