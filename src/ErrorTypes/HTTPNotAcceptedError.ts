export class HTTPNotAcceptedError extends Error {

    public acceptedHeaders: string[];

    constructor(acceptedHeaders: string[], message: string) {
        super();
        this.acceptedHeaders = acceptedHeaders;
        this.message = message;
        this.name = 'HTTPNotAcceptedError';
    }

    get stringifyHeaders() {
        return this.acceptedHeaders.join(', ');
    }

    get headers() {
        return this.acceptedHeaders;
    }
}
