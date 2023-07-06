"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Locals = void 0;
const assign_deep_1 = __importDefault(require("assign-deep"));
const Notores_1 = require("../types/Notores");
class Locals extends Notores_1.Notores.Locals {
    constructor(req, res) {
        super();
        this._contentType = ['json'];
        this._body = {};
        this._payload = {};
        this._url = '';
        this._path = '';
        this._user = null;
        this._query = {};
        this._accepts = ['json'];
        this._error = null;
        this._statusCode = 200;
        this._authenticated = false;
        this._NODE_ENV = process.env.NODE_ENV || 'development';
        this._query = req.query;
        this._payload = req.body;
        this._url = req.originalUrl;
        this._path = req.path;
        this._config = req.config;
        this._accepts = ['json'];
        this._req = req;
        this._res = res;
        if (req.isAuthenticated)
            this._authenticated = req.isAuthenticated() || false;
        if (req.user) {
            this._user = req.user;
        }
    }
    setBody(body, overwrite = false) {
        if (!overwrite && this.bodyPropertyIsSet())
            return;
        return (0, assign_deep_1.default)(this._body, body);
    }
    bodyPropertyIsSet(property) {
        if (!property) {
            return Object.keys(this._body).length > 0;
        }
        return this._body.hasOwnProperty(property);
    }
    get body() {
        return this._body;
    }
    get contentType() {
        return this._contentType;
    }
    set contentType(contentType) {
        this._contentType = contentType;
    }
    addContentType(contentType) {
        Array.isArray(contentType) ?
            this._contentType.push(...contentType) :
            this._contentType.push(contentType);
        return this._contentType;
    }
    get accepts() {
        return this._accepts;
    }
    set accepts(accepts) {
        this._accepts = accepts;
    }
    addAccepts(accepts) {
        Array.isArray(accepts) ?
            this._accepts.push(...accepts) :
            this._accepts.push(accepts);
        return this._accepts;
    }
    get config() {
        return this._config;
    }
    get user() {
        return this._user;
    }
    get query() {
        return this._query;
    }
    get error() {
        return this._error;
    }
    set error(error) {
        this._error = error;
    }
    set statusCode(statusCode) {
        this._statusCode = statusCode;
    }
    get statusCode() {
        return this._statusCode;
    }
    get hasError() {
        return this._statusCode >= 400 && this._statusCode < 600 || this._error !== null;
    }
    get payload() {
        return this._payload;
    }
    get url() {
        return this._url;
    }
    get path() {
        return this._path;
    }
    toJSON() {
        return Object.assign({}, this._body);
    }
}
exports.Locals = Locals;
