const {getModule} = require('./../ModuleHandler');

/**
 * Checks what kind of response to send (html, json), based on the request type, set in ```res.locals.type```
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
const responseHandler = (req, res) => {
    switch (res.locals.type) {
        case 'html':
            return htmlResponder(req, res);
        // case 'xml':
        //     res.set('Content-Type', 'text/xml');
        //     return res.send(`<body><message>hi</message><header>${req.get('Accept')}</header></body>`);
        default:
            return jsonResponder(req, res);
    }
};

/**
 * Sends a theme response if @notores/theme is installed. Otherwise still responds with the jsonResponder
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
const htmlResponder = (req, res) => {
    const {themeResponder, installed} = getModule('@notores/theme');
    if (installed) {
        return themeResponder(req, res);
    }

    return jsonResponder(req, res);
};

/**
 * Sends the value of res.locals.toJSON() as JSON
 * @param {Object} req Express middleware request parameter
 * @param {Object} res Express middleware response parameter
 */
const jsonResponder = (req, res) => {
    res.json(res.locals.toJSON());
};

module.exports = {
    responseHandler,
    htmlResponder,
    jsonResponder
};
