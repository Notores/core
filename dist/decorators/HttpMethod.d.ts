declare type ApiMethodPath = Array<string | RegExp> | string | RegExp;
export declare function Restricted(roles?: string[] | string): (target: any, propertyKey: string) => void;
export declare function Roles(roles: string[]): (target: any, propertyKey: string) => void;
export declare function Authorized(roles: string[]): (target: any, propertyKey: string) => void;
export declare function Authenticated(settings?: {
    redirect: boolean;
}): (target: any, propertyKey: string) => void;
export declare function Admin(): (target: any, propertyKey: string) => void;
/**
 * @deprecated Since version 0.6.0 Will be deleted in version 1.0. Use @Restricted instead.
 */
export declare function Private(): (target: any, propertyKey: string) => void;
export declare function PreMiddleware(middlewares: Function | string | Array<Function | string>): (target: any, propertyKey: string) => void;
export declare function PostMiddleware(middlewares: Function | string | Array<Function | string>): (target: any, propertyKey: string) => void;
export declare function Pages(pages: string[]): (target: any, propertyKey: string) => void;
export declare function Page(page: string): (target: any, propertyKey: string) => void;
export declare function Get(path?: ApiMethodPath): (target: any, propertyKey: string) => void;
export declare function Post(path?: ApiMethodPath): (target: any, propertyKey: string) => void;
export declare function Put(path?: ApiMethodPath): (target: any, propertyKey: string) => void;
export declare function Patch(path?: ApiMethodPath): (target: any, propertyKey: string) => void;
export declare function Delete(path?: ApiMethodPath): (target: any, propertyKey: string) => void;
export declare function GetId(path?: ApiMethodPath): (target: any, propertyKey: string) => void;
export declare function PutId(path?: ApiMethodPath): (target: any, propertyKey: string) => void;
export declare function PatchId(path?: ApiMethodPath): (target: any, propertyKey: string) => void;
export declare function DeleteId(path?: ApiMethodPath): (target: any, propertyKey: string) => void;
export {};
//# sourceMappingURL=HttpMethod.d.ts.map