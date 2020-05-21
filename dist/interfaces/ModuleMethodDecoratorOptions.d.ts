export interface ModuleMethodDecoratorOptions {
    path?: string | RegExp;
    pre?: string | string[] | Function | Function[];
    post?: Array<string | Function> | Function | string;
    authenticated?: boolean;
    pages?: string[];
}
export interface ModuleMiddlewareDecoratorOptionsPre {
    path?: string | RegExp;
    pre?: boolean;
    authenticated?: boolean;
}
export interface ModuleMiddlewareDecoratorOptionsPost {
    path?: string | RegExp;
    post?: boolean;
    authenticated?: boolean;
}
//# sourceMappingURL=ModuleMethodDecoratorOptions.d.ts.map