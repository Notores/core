import { RequestHandler } from 'express';
/**
 * Checks what kind of response to send (html, json), based on the request type, set in ```res.locals.type```
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
export declare const responseHandler: RequestHandler;
/**
 * Sends a theme response if @notores/theme is installed. Otherwise still responds with the jsonResponder
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
export declare const htmlResponder: RequestHandler;
/**
 * Sends the value of res.locals.toJSON() as JSON
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
export declare const jsonResponder: RequestHandler;
//# sourceMappingURL=responseHandler.d.ts.map