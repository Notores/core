"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./../../logger");
const logger = logger_1.initLogger(module);
class Locals {
    constructor(req) {
        this._body = {};
        this._payload = {};
        this._url = '';
        this._path = '';
        this._config = {};
        // modules = {}; //Disabled, because Locals.prototype.modules is undefined
        this._type = 'json';
        this._user = {};
        this._query = {};
        this._authenticated = false;
        this._NODE_ENV = process.env.NODE_ENV || 'development';
        this._authenticated = req.isAuthenticated();
        this._query = req.query;
        this._payload = req.body;
        this._url = req.originalUrl;
        this._path = req.path;
        this._config = req.notores;
        Locals.properties
            .map(obj => JSON.parse(JSON.stringify(obj)))
            .forEach(obj => {
            this[obj.key] = obj.defaultValue;
        });
        if (req.user)
            this._user = req.user;
    }
    static addProperty(key, defaultValue) {
        Locals.properties.push({ key, defaultValue });
    }
    static extend(obj) {
        Object.assign(Locals.prototype, obj);
    }
    static defineProperty(key, obj) {
        Object.defineProperty(Locals.prototype, key, obj);
    }
    static addResponseType(type) {
        if (!Locals.allowedResponseTypes.includes(type))
            Locals.allowedResponseTypes.push(type);
    }
    static addToJsonKeys(keys) {
        if (!Array.isArray(keys))
            keys = [keys];
        Locals.toJsonKeys = [
            ...Locals.toJsonKeys,
            ...keys,
        ];
    }
    env(envCheck = 'production') {
        return this.NODE_ENV === envCheck;
    }
    setBody(body, overwrite = false) {
        if (overwrite)
            return Object.assign(this._body, body);
        if (this.bodyIsSet(body))
            return;
        Object.assign(this._body, body);
    }
    bodyIsSet(body = null) {
        if (!body) {
            return Object.keys(this._body).length > 0;
        }
        const key = Object.keys(body)[0];
        return this._body.hasOwnProperty(key);
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
        if (Locals.allowedResponseTypes.includes(value))
            this._type = value;
        else
            logger.error(`Supplied type "${value}" not allowed`);
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
        let obj = { ...this._body };
        if (this._type === 'html')
            Locals.toJsonKeys.forEach(key => {
                obj[key] = this[key];
            });
        return obj;
    }
}
Locals.toJsonKeys = ['payload', 'url', 'path', 'config']; // For module purposes
Locals.allowedResponseTypes = ['json'];
Locals.properties = [];
const defaultExport = (req, res, next) => {
    // @ts-ignore
    res.locals = new Locals(req);
    next();
};
module.exports = defaultExport;
module.exports.Locals = Locals;
