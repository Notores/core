const {getModule} = require('./../ModuleHandler');

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

const htmlResponder = (req, res) => {
    const {themeResponder, installed} = getModule('notores-theme');
    if (installed) {
        return themeResponder(req, res);
    }

    return jsonResponder(req, res);
};

const jsonResponder = (req, res) => {
    res.json(res.locals.toJSON());
};

module.exports = {
    responseHandler,
    htmlResponder,
    jsonResponder
};
