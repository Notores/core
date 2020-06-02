export declare enum ParamTypes {
    int = "int",
    integer = "int",
    float = "float",
    bool = "boolean",
    boolean = "boolean"
}
export declare function user(target: any, key: string, index: number): void;
export declare function body(target: any, key: string, index: number): void;
export declare function query(target: any, key: string, index: number): void;
export declare function params(target: any, key: string, index: number): void;
export declare function param(key: string, type?: ParamTypes): (target: any, key: string, index: number) => void;
export declare function request(target: any, key: string, index: number): void;
export declare function response(target: any, key: string, index: number): void;
export declare function next(target: any, key: string, index: number): void;
//# sourceMappingURL=Api.d.ts.map