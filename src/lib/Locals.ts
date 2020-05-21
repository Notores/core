import './../namespace/Notores'
import {RequestHandler, Request, Response, NextFunction} from "express";
import loggerFactory from "./logger";
import {MiddlewareFunction} from "../namespace/Notores";
import {join} from 'path';

const logger = loggerFactory(module);

interface KeyValueObject {
    [key: string]: any;
}

export class Locals implements KeyValueObject {

    static toJsonKeys = ['payload', 'url', 'path', 'config']; // For module purposes
    static allowedResponseTypes: Array<string> = ['json'];

    static properties: Array<{ key: string, defaultValue: any }> = [];

    static addProperty(key: string, defaultValue: any) {
        Locals.properties.push({key, defaultValue});
    }

    static extend(obj: object) {
        Object.assign(Locals.prototype, obj);
    }

    static defineProperty(key: string, obj: any) {
        Object.defineProperty(Locals.prototype, key, obj);
    }

    static addResponseType(type: string) {
        if (!Locals.allowedResponseTypes.includes(type))
            Locals.allowedResponseTypes.push(type);
    }

    static addToJsonKeys(keys: Array<string> | string) {
        if (!Array.isArray(keys))
            keys = [keys];
        Locals.toJsonKeys = [
            ...Locals.toJsonKeys,
            ...keys,
        ];
    }

    private _contentType: string = 'json';
    private _body = {};
    private readonly _payload = {};
    private readonly _url: string = '';
    private readonly _path: string = '';
    private readonly _config = {};
    // modules = {}; //Disabled, because Locals.prototype.modules is undefined
    private _type = 'json';
    private _user = {};
    private _query = {};
    private _error: { status: number, message: string } = {status: 0, message: ''};
    private _authenticated: Boolean = false;
    private _NODE_ENV = process.env.NODE_ENV || 'development';
    private _extended: boolean | { path: string; data: any } = false;
    private _ejs_paths: string[] = [];
    private _ejs_pages: string[] = [];


    constructor(req: Request) {
        this._authenticated = req.isAuthenticated();
        this._query = req.query;
        this._payload = req.body;
        this._url = req.originalUrl;
        this._path = req.path;
        this._config = req.notores;
        this._type = req.accepts(['html', 'json']) || 'json';

        Locals.properties
            .map(obj => JSON.parse(JSON.stringify(obj)))
            .forEach(obj => {
                (this as KeyValueObject)[obj.key] = obj.defaultValue;
            })

        if (req.user)
            this._user = req.user;
    }

    env(envCheck = 'production') {
        return this.NODE_ENV === envCheck
    }

    setBody(body: object, overwrite = false) {
        if (overwrite)
            return Object.assign(this._body, body);

        if (this.bodyIsSet(body))
            return;

        Object.assign(this._body, body);
    }

    bodyIsSet(body: object | null = null) {
        if (!body) {
            return Object.keys(this._body).length > 0;
        }
        const key = Object.keys(body)[0];
        return this._body.hasOwnProperty(key);
    }

    addPageLocations(locations: string[]) {
        this._ejs_paths.push(...locations);
    }

    addPages(pages: string[]) {
        this._ejs_pages.push(...pages);
    }

    extend = (path: string, data: any) => {
        this._extended = {path, data};
    };

    get extended() {
        return this._extended;
    }

    get isExtended(): boolean {
        return !!this._extended
    }

    get pageLocations() {
        return this._ejs_paths;
    }

    get pages() {
        return this._ejs_pages;
    }

    get body() {
        return this._body;
    }

    get type() {
        return this._type;
    }

    get config() {
        return this._config;
    }

    set type(value) {
        this._type = value;
    }

    get user() {
        return this._user;
    }

    set user(value) {
        this._user = value;
    }

    get query() {
        return this._query;
    }

    set query(value) {
        this._query = value;
    }

    get authenticated() {
        return this._authenticated;
    }

    set authenticated(value) {
        this._authenticated = value;
    }

    set error(obj: { status: number, message: string }) {
        this._error = obj;
    }

    get error(): { status: number, message: string } {
        return this._error;
    }

    get NODE_ENV() {
        return this._NODE_ENV;
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
        let obj: KeyValueObject = {...this._body};

        if (this._type === 'html')
            Locals.toJsonKeys.forEach(key => {
                obj[key] = (this as KeyValueObject)[key]
            });

        return obj;
    }
}

const defaultExport: MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => {
    res.locals = new Locals(req);
    next();
};


module.exports = defaultExport;

module.exports.Locals = Locals;
