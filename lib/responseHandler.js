"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleHandler_1 = require("./../ModuleHandler");
/**
 * Checks what kind of response to send (html, json), based on the request type, set in ```res.locals.type```
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
exports.responseHandler = (req, res, next) => {
    switch (res.locals.type) {
        case 'html':
            return exports.htmlResponder(req, res, next);
        // case 'xml':
        //     res.set('Content-Type', 'text/xml');
        //     return res.send(`<body><message>hi</message><header>${req.get('Accept')}</header></body>`);
        default:
            return exports.jsonResponder(req, res, next);
    }
};
/**
 * Sends a theme response if @notores/theme is installed. Otherwise still responds with the jsonResponder
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
exports.htmlResponder = (req, res, next) => {
    const { themeResponder, installed } = ModuleHandler_1.getModule('@notores/theme');
    if (installed) {
        return themeResponder(req, res, next);
    }
    return exports.jsonResponder(req, res, next);
};
/**
 * Sends the value of res.locals.toJSON() as JSON
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
exports.jsonResponder = (req, res, next) => {
    res.json(res.locals.toJSON());
};
module.exports = {
    responseHandler: exports.responseHandler,
    htmlResponder: exports.htmlResponder,
    jsonResponder: exports.jsonResponder
};
