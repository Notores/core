export interface ModuleMiddlewareDecoratorOptions {
    paths?: Array<string | RegExp> | string | RegExp;
    pre?: boolean;
    post?: boolean;
    authenticated?: boolean;
}
