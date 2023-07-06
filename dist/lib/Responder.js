"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainResponder = exports.errorResponseHandler = exports.responseHandler = void 0;
const Notores_1 = require("../Notores");
const Logger_1 = require("./Logger");
const Notores_2 = require("../types/Notores");
const logger = (0, Logger_1.systemLoggerFactory)('@notores/core - Responder');
function responseHandler(req, res) {
    if (res.headersSent) {
        return;
    }
    const responders = Notores_1.NotoresApplication.app.responders;
    let responder = new MainResponder();
    for (const type of res.locals.contentType) {
        responder = responders.find((responder) => responder.type.toLowerCase().includes(type.toLowerCase()));
        if (responder)
            continue;
    }
    responder.responder(req, res);
}
exports.responseHandler = responseHandler;
function errorResponseHandler(error, req, res, next) {
    if (res.headersSent) {
        return;
    }
    responseHandler(req, res);
}
exports.errorResponseHandler = errorResponseHandler;
class MainResponder extends Notores_2.Notores.Responder {
    constructor() {
        super(...arguments);
        this._type = '';
    }
    responder(req, res) {
        res.status(res.locals.statusCode);
        res.send(res.locals.body);
    }
    get type() {
        return this._type.toLowerCase();
    }
    set type(type) {
        this._type = type;
    }
}
exports.MainResponder = MainResponder;
