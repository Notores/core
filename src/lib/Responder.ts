import {NextFunction, Request, Response} from 'express';
import {NotoresApplication} from "../Notores";
import {systemLoggerFactory} from "./Logger";
import {Notores} from "../types/Notores";

const logger = systemLoggerFactory('@notores/core - Responder')

export function responseHandler(req: Request, res: Response) {
    if (res.headersSent) {
        return;
    }
    const responders = NotoresApplication.app.responders;

    let responder: Notores.Responder = new MainResponder();
    for (const type of res.locals.contentType) {
        responder = responders.find((responder: Notores.Responder) => responder.type.toLowerCase().includes(type.toLowerCase()));
        if (responder)
            continue;
    }

    responder.responder(req, res);
}

export function errorResponseHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return;
    }
    responseHandler(req, res);
}


export class MainResponder extends Notores.Responder {
    _type = '';

    responder (req: Request, res: Response) {
        res.status(res.locals.statusCode);
        res.send(res.locals.body);
    }

    get type() {
        return this._type.toLowerCase();
    }

    set type(type: string) {
        this._type = type;
    }
}

