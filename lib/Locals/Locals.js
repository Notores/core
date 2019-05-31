const logger = require('./../../logger')(module);

class Locals {

    static toJsonKeys = ['payload', 'url', 'path', 'config']; // For module purposes
    static allowedResponseTypes = ['json'];

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

    #body = {};
    #payload = {};
    #url = '';
    #path = '';
    #config = {};
    // modules = {}; //Disabled, because Locals.prototype.modules is undefined
    #type = 'json';
    #user = {};
    #query = {};
    #authenticated = false;
    #NODE_ENV = process.env.NODE_ENV || 'development';

    constructor(req) {
        this.#authenticated = req.isAuthenticated();
        this.#query = req.query;
        this.#payload = req.body;
        this.#url = req.originalUrl;
        this.#path = req.path;
        this.#config = req.notores;

        if (req.user)
            this.#user = req.user;
    }

    env(envCheck = 'production') {
        return this.NODE_ENV === envCheck
    }

    setBody(body, overwrite = false) {
        if (overwrite)
            return Object.assign(this.#body, body);

        if (this.bodyIsSet(body))
            return;

        Object.assign(this.#body, body);
    }

    bodyIsSet(body = null) {
        if (!body) {
            return Object.keys(this.#body).length > 0;
        }
        const key = Object.keys(body)[0];
        return this.#body.hasOwnProperty(key);
    }

    get body() {
        return this.#body;
    }

    get type() {
        return this.#type;
    }

    get config() {
        return this.#config;
    }

    set type(value) {
        if (Locals.allowedResponseTypes.includes(value))
            this.#type = value;
        else
            logger.error(`Supplied type "${value}" not allowed`);
    }

    get user() {
        return this.#user;
    }

    set user(value) {
        this.#user = value;
    }

    get query() {
        return this.#query;
    }

    set query(value) {
        this.#query = value;
    }

    get authenticated() {
        return this.#authenticated;
    }

    set authenticated(value) {
        this.#authenticated = value;
    }

    get NODE_ENV() {
        return this.#NODE_ENV;
    }

    get payload() {
        return this.#payload;
    }

    get url() {
        return this.#url;
    }

    get path() {
        return this.#path;
    }

    toJSON() {
        let obj = {...this.#body};

        if (this.#type === 'html')
            Locals.toJsonKeys.forEach(key => {
                obj[key] = this[key]
            });

        return obj;
    }
}

Locals.prototype.modules = {};

module.exports = (req, res, next) => {
    res.locals = new Locals(req);
    next();
};

module.exports.Locals = Locals;
