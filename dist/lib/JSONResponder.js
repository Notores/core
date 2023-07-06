"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONResponder = void 0;
const Responder_1 = require("./Responder");
class JSONResponder extends Responder_1.MainResponder {
    constructor() {
        super(...arguments);
        this._type = 'application/json';
        this.responder = (req, res) => {
            res.status(res.locals.statusCode);
            if (res.locals.hasError) {
                return res.json({ error: res.locals.error });
            }
            res.json(res.locals.toJSON());
        };
    }
}
exports.JSONResponder = JSONResponder;
