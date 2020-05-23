"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPNotAcceptedError = void 0;
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
exports.HTTPNotAcceptedError = HTTPNotAcceptedError;
