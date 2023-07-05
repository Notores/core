import { MainResponder } from "./Responder";
export class JSONResponder extends MainResponder {
    _type = 'application/json';
    responder = (req, res) => {
        res.status(res.locals.statusCode);
        if (res.locals.hasError) {
            return res.json({ error: res.locals.error });
        }
        res.json(res.locals.toJSON());
    };
}
