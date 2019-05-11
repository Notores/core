const {join} = require('path');
const {getConfig} = require('./config');
const {getThemePath} = require('./routeUtils');

function serveStatic(admin = false) {
    return (req, res, next) => {
        if (admin && req.path.indexOf('/n-admin') === 0) {
            return next('route');
        }

        const notoresConfig = getConfig();

        const options = {
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        const themePath = getThemePath(notoresConfig.theme, admin);
        const path = join(themePath, req.path);

        res.sendFile(path, options, err => {
            if (err) {
                return next();
            }
        })
    }
}

module.exports = {
    serveStatic,
};
