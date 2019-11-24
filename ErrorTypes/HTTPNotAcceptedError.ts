class HTTPNotAcceptedError extends Error {
    private readonly acceptedHeaders: Array<string>;

    constructor(acceptedHeaders : Array<string>, message : string) {
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

module.exports = HTTPNotAcceptedError;
