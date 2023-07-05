export interface ModuleDecoratorOptions {
    key?: string;
    prefix?: string;
    dataKey?:string;
    responseAsBody?: boolean;
    // table?: string[];
    entity?: any;
    entities?: any[];
    repository?: any;
}
