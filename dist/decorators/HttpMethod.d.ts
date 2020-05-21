import { ModuleMethodDecoratorOptions } from "../interfaces/ModuleMethodDecoratorOptions";
export declare function Restricted(roles?: string[] | string): (target: any, propertyKey: string) => void;
export declare function Roles(roles?: string[]): (target: any, propertyKey: string) => void;
export declare function Authorized(roles?: string[]): (target: any, propertyKey: string) => void;
export declare function Authenticated(settings?: {
    redirect: boolean;
}): (target: any, propertyKey: string) => void;
export declare function Admin(): (target: any, propertyKey: string) => void;
export declare function Private(): (target: any, propertyKey: string) => void;
export declare function Middleware(middlewares?: any): (target: any, propertyKey: string) => void;
export declare function Page(pages: string | string[]): (target: any, propertyKey: string) => void;
export declare function Get(settings?: ModuleMethodDecoratorOptions | string): (target: any, propertyKey: string) => void;
export declare function Post(settings?: ModuleMethodDecoratorOptions | string): (target: any, propertyKey: string) => void;
export declare function Put(settings?: ModuleMethodDecoratorOptions | string): (target: any, propertyKey: string) => void;
export declare function Patch(settings?: ModuleMethodDecoratorOptions | string): (target: any, propertyKey: string) => void;
export declare function Delete(settings?: ModuleMethodDecoratorOptions | string): (target: any, propertyKey: string) => void;
export declare function GetId(settings?: ModuleMethodDecoratorOptions | string): (target: any, propertyKey: string) => void;
export declare function PutId(settings?: ModuleMethodDecoratorOptions | string): (target: any, propertyKey: string) => void;
export declare function PatchId(settings?: ModuleMethodDecoratorOptions | string): (target: any, propertyKey: string) => void;
export declare function DeleteId(settings?: ModuleMethodDecoratorOptions | string): (target: any, propertyKey: string) => void;
//# sourceMappingURL=HttpMethod.d.ts.map