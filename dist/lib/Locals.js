import assign from 'assign-deep';
import { Notores } from '../types/Notores';
export class Locals extends Notores.Locals {
    _contentType = ['json'];
    _body = {};
    _payload = {};
    _url = '';
    _path = '';
    _user = null;
    _query = {};
    _accepts = ['json'];
    _error = null;
    _statusCode = 200;
    _authenticated = false;
    _NODE_ENV = process.env.NODE_ENV || 'development';
    constructor(req, res) {
        super();
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
        return assign(this._body, body);
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
        return { ...this._body };
    }
}
