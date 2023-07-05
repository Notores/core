import {Request, Response} from 'express';
import {MainResponder} from "./Responder";

export class JSONResponder extends MainResponder {
    _type: string = 'application/json';

    responder = (req: Request, res: Response) => {
        res.status(res.locals.statusCode);

        if (res.locals.hasError) {
            return res.json({error: res.locals.error})
        }
        res.json(res.locals.toJSON());
    }
}