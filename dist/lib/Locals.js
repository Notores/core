"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Locals = void 0;
require("../namespace/Notores");
const path_1 = require("path");
const Responder_1 = __importDefault(require("./Responder"));
let Locals = /** @class */ (() => {
    class Locals {
        constructor(req, res) {
            this._contentType = 'json';
            this._body = {};
            this._payload = {};
            this._url = '';
            this._path = '';
            this._config = {};
            // modules = {}; //Disabled, because Locals.prototype.modules is undefined
            this._type = 'json';
            this._user = {};
            this._query = {};
            this._error = { status: 0, message: '' };
            this._authenticated = false;
            this._NODE_ENV = process.env.NODE_ENV || 'development';
            this._extended = false;
            this._ejs_paths = [];
            this._ejs_pages = [];
            this.extend = (path, data) => {
                this._extended = { path, data };
            };
            this.include = async (path, obj) => {
                if (this._res.headersSent)
                    return;
                const filePath = path_1.join(this.currentRenderPath, '..', path);
                for (let key in obj) {
                    // @ts-ignore
                    this[key] = obj[key];
                }
                return await Responder_1.default.render(filePath, this);
            };
            this.redirect = (path) => {
                this._res.redirect(path);
            };
            this._authenticated = req.isAuthenticated();
            this._query = req.query;
            this._payload = req.body;
            this._url = req.originalUrl;
            this._path = req.path;
            this._config = req.notores;
            this._type = req.accepts(['html', 'json']) || 'json';
            this._req = req;
            this._res = res;
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
        addPageLocations(locations) {
            this._ejs_paths.push(...locations);
        }
        addPages(pages) {
            this._ejs_pages.push(...pages);
        }
        get extended() {
            return this._extended;
        }
        get isExtended() {
            return !!this._extended;
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
            this._type = this._req.accepts(value) || 'json'; // Default to JSON
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
        set error(obj) {
            this._error = obj;
        }
        get error() {
            return this._error;
        }
        get hasError() {
            return this._error.status >= 400 && this._error.status < 600;
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
        toJSON(forType = '') {
            let obj = { ...this._body };
            if (!forType && this._type === 'html' || forType === 'html')
                Locals.toJsonKeys.forEach(key => {
                    obj[key] = this[key];
                });
            return obj;
        }
    }
    Locals.toJsonKeys = ['payload', 'url', 'path', 'config']; // For module purposes
    Locals.allowedResponseTypes = ['json'];
    Locals.properties = [];
    return Locals;
})();
exports.Locals = Locals;
const defaultExport = (req, res, next) => {
    res.locals = new Locals(req, res);
    next();
};
module.exports = defaultExport;
module.exports.Locals = Locals;
