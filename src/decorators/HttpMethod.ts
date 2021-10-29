import {logErrorApiMetaDataDoesNotExist, logWarningIfNoAuthentication} from "./helpers";
import {apiMetadataKey} from "../symbols";
import {SystemLogger} from "../Notores";
import ApiMetaData, {HttpMethod} from "../lib/ApiMetaData";

declare type ApiMethodPath = Array<string | RegExp> | string | RegExp;

declare type TargetReturnType = (target: any, propertyKey: any) => void;

function getApiMetaData(target: any, propertyKey: string) {
    const existingApiMetaData: ApiMetaData = Reflect.getOwnMetadata(apiMetadataKey, target[propertyKey]);

    if (!existingApiMetaData) {
        throw logErrorApiMetaDataDoesNotExist('Restricted', target, propertyKey);
    }
    return existingApiMetaData;
}

function generateHttpMethodDecorator(method: HttpMethod, addId = false) {
    return function Path(paths: ApiMethodPath = ['/']) {
        return function (target: any, propertyKey: string) {
            const existingApiMetaData: ApiMetaData = Reflect.getOwnMetadata(
                apiMetadataKey,
                target[propertyKey]
            ) ?? new ApiMetaData(method, target, propertyKey, addId);

            existingApiMetaData.paths = Array.isArray(paths) ? paths : [paths];

            Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
        }
    }
}

export function TemplateAccess() {
    return (target: any, propertyKey: any): void => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.templateAccess = true;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    };
}

export function ContentType(type: string): TargetReturnType {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.contentType = type;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Accepts(type: string): TargetReturnType;
export function Accepts(type: string[]): TargetReturnType;
export function Accepts(...type: string[]): TargetReturnType;
export function Accepts(): TargetReturnType {
    const type: string[] = [...new Set(arguments)];

    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.accepts = Array.isArray(type) ? type : [type];

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Restricted(role: string): TargetReturnType;
export function Restricted(roles: string[]): TargetReturnType;
export function Restricted(): TargetReturnType {
    const roles: string[] = [...new Set(arguments)];
    if (roles.length === 0) {
        roles.push('admin');
    }

    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        logWarningIfNoAuthentication('Restricted', target, propertyKey);

        existingApiMetaData.setRestricted(roles);

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Roles(roles: string[]) {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        logWarningIfNoAuthentication('Roles', target, propertyKey);

        existingApiMetaData.roles = roles;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Authorized(roles: string[]) {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.setAuthorized(roles);

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Authenticated(settings = {redirect: false}) {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.setAuthenticated(settings);

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Admin() {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.setAdmin();

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

/**
 * @deprecated Since version 0.6.0 Will be deleted in version 1.0. Use @Restricted instead.
 */
export function Private() {
    return (target: any, propertyKey: string) => {
        SystemLogger.warn('Decorator @Private is deprecated, please use @Restricted instead');
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.setRestricted(['admin'])

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function PreMiddleware(middleware: Function): TargetReturnType;
export function PreMiddleware(functionName: string): TargetReturnType;
export function PreMiddleware(middlewares: Array<Function>): TargetReturnType;
export function PreMiddleware(functionNames: Array<string>): TargetReturnType;
export function PreMiddleware(middlewaresAndFunctionNames: Array<Function | string>): TargetReturnType;
export function PreMiddleware(input: any): TargetReturnType {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.preMiddlewares = input;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function PostMiddleware(middleware: Function): TargetReturnType;
export function PostMiddleware(functionName: string): TargetReturnType;
export function PostMiddleware(middlewares: Array<Function>): TargetReturnType;
export function PostMiddleware(functionNames: Array<string>): TargetReturnType;
export function PostMiddleware(middlewaresAndFunctionNames: Array<Function | string>): TargetReturnType;
export function PostMiddleware(input: any): TargetReturnType {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.postMiddlewares = input;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Pages(pages: string[]) {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.pages = pages;

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Page(page: string) {
    return (target: any, propertyKey: string) => {
        const existingApiMetaData: ApiMetaData = getApiMetaData(target, propertyKey);

        existingApiMetaData.pages = [page];

        Reflect.defineMetadata(apiMetadataKey, existingApiMetaData, target[propertyKey]);
    }
}

export function Get(path?: ApiMethodPath) {
    return generateHttpMethodDecorator(HttpMethod.GET)(path);
}

export function Post(path?: ApiMethodPath) {
    return generateHttpMethodDecorator(HttpMethod.POST)(path);
}

export function Put(path?: ApiMethodPath) {
    return generateHttpMethodDecorator(HttpMethod.PUT)(path);
}

export function Patch(path?: ApiMethodPath) {
    return generateHttpMethodDecorator(HttpMethod.PATCH)(path);
}

export function Delete(path?: ApiMethodPath) {
    return generateHttpMethodDecorator(HttpMethod.DELETE)(path);
}

export function GetId(path?: ApiMethodPath) {
    return generateHttpMethodDecorator(HttpMethod.GET, true)(path);
}

export function PutId(path?: ApiMethodPath) {
    return generateHttpMethodDecorator(HttpMethod.PUT, true)(path);
}

export function PatchId(path?: ApiMethodPath) {
    return generateHttpMethodDecorator(HttpMethod.PATCH, true)(path);
}

export function DeleteId(path?: ApiMethodPath) {
    return generateHttpMethodDecorator(HttpMethod.DELETE, true)(path);
}
