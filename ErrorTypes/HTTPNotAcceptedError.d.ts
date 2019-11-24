declare class HTTPNotAcceptedError extends Error {
    private readonly acceptedHeaders;
    constructor(acceptedHeaders: Array<string>, message: string);
    readonly stringifyHeaders: string;
    readonly headers: string[];
}
//# sourceMappingURL=HTTPNotAcceptedError.d.ts.map