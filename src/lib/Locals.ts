import {Query} from 'express-serve-static-core'
import {Request, Response} from 'express';
import assign from 'assign-deep';
import { Notores } from '../types/Notores';

export class Locals extends Notores.Locals {

    _contentType: string[] = ['json'];
     _body: Record<string, any> = {};
     _payload: Record<string, any> = {};
     _url: string = '';
     _path: string = '';
     _user: Notores.User | null = null;
     _query: Query = {};
     _accepts: string[] = ['json'];
     _error: Error | null = null;
     _statusCode: number = 200;
     _authenticated: boolean = false;
     _NODE_ENV: string = process.env.NODE_ENV || 'development';

    constructor(req: Request, res: Response) {
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

    setBody(body: Record<string, any>, overwrite: boolean = false) {
        if (!overwrite && this.bodyPropertyIsSet()) return;

        return assign(this._body, body);
    }

    bodyPropertyIsSet(property?: string) {
        if (!property) {
            return Object.keys(this._body).length > 0;
        }
        return this._body.hasOwnProperty(property);
    }

    get body() {
        return this._body;
    }

    get contentType() {
        return this._contentType
    }

    set contentType(contentType: string[]) {
        this._contentType = contentType;
    }

    addContentType(contentType: string | string[]) {
        Array.isArray(contentType) ?
            this._contentType.push(...contentType) :
            this._contentType.push(contentType);
        return this._contentType;
    }

    get accepts() {
        return this._accepts;
    }

    set accepts(accepts: string[]) {
        this._accepts = accepts;
    }

    addAccepts(accepts: string | string[]) {
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

    get query(): Query {
        return this._query;
    }

    get error(): Error {
        return this._error;
    }

    set error(error: Error) {
        this._error = error;
    }

    set statusCode(statusCode: number) {
        this._statusCode = statusCode;
    }

    get statusCode(): number {
        return this._statusCode;
    }

    get hasError(): boolean {
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
        return {...this._body};
    }
}