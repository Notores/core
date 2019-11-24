import {getModule} from './../ModuleHandler';
import {Request, Response, RequestHandler, NextFunction} from 'express';

/**
 * Checks what kind of response to send (html, json), based on the request type, set in ```res.locals.type```
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
export const responseHandler : RequestHandler = (req: Request, res: Response, next: NextFunction): Promise<any> => {
    switch (res.locals.type) {
        case 'html':
            return htmlResponder(req, res, next);
        // case 'xml':
        //     res.set('Content-Type', 'text/xml');
        //     return res.send(`<body><message>hi</message><header>${req.get('Accept')}</header></body>`);
        default:
            return jsonResponder(req, res, next);
    }
};

/**
 * Sends a theme response if @notores/theme is installed. Otherwise still responds with the jsonResponder
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
export const htmlResponder : RequestHandler = (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {themeResponder, installed} = getModule('@notores/theme');
    if (installed) {
        return themeResponder(req, res, next);
    }

    return jsonResponder(req, res, next);
};

/**
 * Sends the value of res.locals.toJSON() as JSON
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
export const jsonResponder : RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    res.json(res.locals.toJSON());

};

module.exports = {
    responseHandler,
    htmlResponder,
    jsonResponder
};
