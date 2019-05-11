class Locals {

    static toJsonKeys = ['body'];

    static extend(obj) {
        Object.assign(Locals.prototype.modules, obj);
    }

    static defineProperty(key, obj) {
        Object.defineProperty(Locals.prototype, key, obj);
    }

    static addToJsonKeys(keys) {
        if(!Array.isArray(keys))
            keys = [keys];
        Locals.toJsonKeys = [
            ...Locals.toJsonKeys,
            ...keys,
        ];
    }

    #body = {};
    // modules = {}; //Disabled, because Locals.prototype.modules is undefined
    #type = 'json';
    #user = {};
    #query = {};
    #authenticated = false;
    #NODE_ENV = process.env.NODE_ENV || 'development';

    constructor(req) {
        this.#authenticated = req.isAuthenticated();
        this.#query = req.query;

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

    set type(value) {
        this.#type = value;
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

    toJSON() {
        let obj = {};

        if (this.#type === 'html')
            Locals.toJsonKeys.forEach(key => {
                obj[key] = this[key]
            });
        else
            obj = this.#body;

        return obj;
    }
}

Locals.prototype.modules = {};

module.exports = (req, res, next) => {
    res.locals = new Locals(req);
    next();
};

module.exports.Locals = Locals;
