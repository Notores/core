class HTTPNotAcceptedError extends Error {

    constructor(acceptedHeaders, message) {
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
