export declare class HTTPNotAcceptedError extends Error {
    acceptedHeaders: string[];
    constructor(acceptedHeaders: string[], message: string);
    get stringifyHeaders(): string;
    get headers(): string[];
}
//# sourceMappingURL=HTTPNotAcceptedError.d.ts.map