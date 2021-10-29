declare type ApiMethodPath = Array<string | RegExp> | string | RegExp;
declare type TargetReturnType = (target: any, propertyKey: any) => void;
export declare function TemplateAccess(): (target: any, propertyKey: any) => void;
export declare function ContentType(type: string): TargetReturnType;
export declare function Accepts(type: string): TargetReturnType;
export declare function Accepts(type: string[]): TargetReturnType;
export declare function Accepts(...type: string[]): TargetReturnType;
export declare function Restricted(role: string): TargetReturnType;
export declare function Restricted(roles: string[]): TargetReturnType;
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
export declare function PreMiddleware(middleware: Function): TargetReturnType;
export declare function PreMiddleware(functionName: string): TargetReturnType;
export declare function PreMiddleware(middlewares: Array<Function>): TargetReturnType;
export declare function PreMiddleware(functionNames: Array<string>): TargetReturnType;
export declare function PreMiddleware(middlewaresAndFunctionNames: Array<Function | string>): TargetReturnType;
export declare function PostMiddleware(middleware: Function): TargetReturnType;
export declare function PostMiddleware(functionName: string): TargetReturnType;
export declare function PostMiddleware(middlewares: Array<Function>): TargetReturnType;
export declare function PostMiddleware(functionNames: Array<string>): TargetReturnType;
export declare function PostMiddleware(middlewaresAndFunctionNames: Array<Function | string>): TargetReturnType;
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