import {initLogger} from "./../../logger";
import {RequestHandler, Request as ERequest} from "express";
import {Request, Params} from "express-serve-static-core";
import {StringKeyObject} from "../../Types";


const logger = initLogger(module);

class Locals implements StringKeyObject {

    static toJsonKeys = ['payload', 'url', 'path', 'config']; // For module purposes
    static allowedResponseTypes : Array<string> = ['json'];

    static properties : Array<{key: string, defaultValue: any}>= [];

    static addProperty(key : string, defaultValue : any) {
        Locals.properties.push({key, defaultValue});
    }

    static extend(obj : object) {
        Object.assign(Locals.prototype, obj);
    }

    static defineProperty(key : string, obj : any) {
        Object.defineProperty(Locals.prototype, key, obj);
    }

    static addResponseType(type : string) {
        if (!Locals.allowedResponseTypes.includes(type))
            Locals.allowedResponseTypes.push(type);
    }

    static addToJsonKeys(keys : Array<string>|string) {
        if (!Array.isArray(keys))
            keys = [keys];
        Locals.toJsonKeys = [
            ...Locals.toJsonKeys,
            ...keys,
        ];
    }

    private _body = {};
    private readonly _payload = {};
    private readonly _url : string = '';
    private readonly _path : string = '';
    private readonly _config = {};
    // modules = {}; //Disabled, because Locals.prototype.modules is undefined
    private _type = 'json';
    private _user = {};
    private _query = {};
    private _authenticated : Boolean= false;
    private _NODE_ENV = process.env.NODE_ENV || 'development';

    constructor(req : Request<Params, any, any> & ERequest){
        this._authenticated = req.isAuthenticated();
        this._query = req.query;
        this._payload = req.body;
        this._url = req.originalUrl;
        this._path = req.path;
        this._config = req.notores;

        Locals.properties
            .map(obj => JSON.parse(JSON.stringify(obj)))
            .forEach(obj => {
                (this as StringKeyObject)[obj.key] = obj.defaultValue;
            })

        if (req.user)
            this._user = req.user;
    }

    env(envCheck = 'production') {
        return this.NODE_ENV === envCheck
    }

    setBody(body : object, overwrite = false) {
        if (overwrite)
            return Object.assign(this._body, body);

        if (this.bodyIsSet(body))
            return;

        Object.assign(this._body, body);
    }

    bodyIsSet(body : object|null = null) {
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
        let obj : StringKeyObject = {...this._body};

        if (this._type === 'html')
            Locals.toJsonKeys.forEach(key => {
                obj[key] = (this as StringKeyObject)[key]
            });

        return obj;
    }
}

const defaultExport : RequestHandler = (req, res, next) => {
    // @ts-ignore
    res.locals = new Locals(req);
    next();
};


module.exports = defaultExport;

module.exports.Locals = Locals;
