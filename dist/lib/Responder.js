import { NotoresApplication } from "../Notores";
import { systemLoggerFactory } from "./Logger";
import { Notores } from "../types/Notores";
const logger = systemLoggerFactory('@notores/core - Responder');
export function responseHandler(req, res) {
    if (res.headersSent) {
        return;
    }
    const responders = NotoresApplication.app.responders;
    let responder = new MainResponder();
    for (const type of res.locals.contentType) {
        responder = responders.find((responder) => responder.type.toLowerCase().includes(type.toLowerCase()));
        if (responder)
            continue;
    }
    responder.responder(req, res);
}
export function errorResponseHandler(error, req, res, next) {
    if (res.headersSent) {
        return;
    }
    responseHandler(req, res);
}
export class MainResponder extends Notores.Responder {
    _type = '';
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
