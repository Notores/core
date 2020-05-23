"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const ejs = __importStar(require("ejs"));
const { access, readFile } = fs_1.promises;
class Responder {
    constructor() {
        this.responseHandler = (req, res, next) => {
            if (res.locals.type === 'html') {
                return this.htmlResponder(req, res);
            }
            else {
                this.jsonResponder(req, res, next);
            }
        };
        this.jsonResponder = (req, res, next) => {
            if (res.locals.hasError) {
                const error = res.locals.error;
                res.status(error.status);
                res.json({ error: error.message instanceof Error ? error.message.message : error.message });
                return;
            }
            res.json(res.locals.toJSON());
        };
        this.htmlResponder = async (req, res) => {
            const path = await this.validateThemePaths(this.getThemePaths(req, res), req);
            let html = await this.render(path, res.locals);
            if (res.locals.isExtended) {
                const paths = this.genPaths(req, res.locals.extended.path).map(path => path_1.join(this.getFullThemeDir(req), path));
                const path = await this.validateThemePaths(paths, req);
                for (let key in res.locals.extended.data) {
                    res.locals[key] = res.locals.extended.data[key];
                }
                res.locals.content = html;
                html = await this.render(path, res.locals);
            }
            res.send(html);
        };
        this.render = async (path, data) => {
            const template = await readFile(path, 'utf-8');
            return ejs.render(template, data, { cache: false, filename: path });
        };
        this.validateThemePaths = async (paths, req) => {
            for (let i = 0; i < paths.length; i++) {
                try {
                    await access(paths[i], fs_1.constants.R_OK);
                    return paths[i];
                }
                catch (e) {
                    // console.log('Path NOT OK');
                }
            }
            return path_1.join(this.getThemeDir(req), 'pages', '404.ejs');
        };
        this.getThemePaths = (req, res) => {
            const pages = [];
            if (res.locals.hasError) {
                pages.push(...this.genPaths(req, `/${res.locals.error.status}`));
                pages.push(...this.genPaths(req, `/500`));
            }
            else {
                res.locals.pages.forEach((page) => {
                    console.log(this.genPaths(req, page));
                    pages.push(...this.genPaths(req, page));
                });
                pages.push(...this.genPaths(req, req.path));
                if (req.path === '/') {
                    pages.push(...this.genPaths(req, '/index'));
                }
            }
            pages.push(...this.genPaths(req, '/404'));
            const paths = [];
            const themeDir = path_1.join(process.cwd(), 'public', 'themes', this.getThemeDir(req));
            const localsLocations = res.locals.pageLocations;
            pages.forEach((page) => {
                paths.push(path_1.join(themeDir, page));
                localsLocations.forEach((loc) => {
                    paths.push(path_1.join(loc, page));
                });
            });
            return paths;
        };
        this.serverStatic = async (req, res, next) => {
            if (req.notores.theme === false) {
                return next();
            }
            const paths = this.generatePaths(req);
            for (let path of paths) {
                if (path.indexOf('.html') > -1) {
                    return next();
                }
            }
            const options = {
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            const validatedPath = await this.validateThemePaths(paths, req);
            if (validatedPath.includes('404.ejs')) {
                return next();
            }
            res.sendFile(validatedPath, options, err => {
                if (err) {
                    res.locals.error = { status: 500, message: err.message };
                    return next();
                }
            });
        };
        this.generatePaths = (req) => {
            let url = req.url;
            if (req.url === '/')
                url = '/index';
            let urls = [url];
            urls.push(req.originalUrl.split(/[?#]/)[0]);
            const themeDir = this.getThemeDir(req);
            return urls.map((u) => {
                return path_1.join(process.cwd(), './public/themes', themeDir, u);
            });
        };
        this.getFullThemeDir = (req) => path_1.join(process.cwd(), 'public', 'themes', this.getThemeDir(req));
        this.getThemeDir = (req) => {
            const url = req.originalUrl;
            const themeConfig = req.notores.theme;
            if (url.indexOf('n-admin') === 0)
                return path_1.join(themeConfig.admin.name, 'admin');
            else
                return path_1.join(themeConfig.public.name, 'public');
        };
    }
    genPaths(req, path) {
        const paths = [];
        if (!path.startsWith('/')) {
            path = `/${path}`;
        }
        if (req.path !== '/' && ['.js', '.ts'].includes(req.path.substr(req.path.length - 3))) {
            paths.push(`${path}`);
        }
        paths.push(`/pages${path}.ejs`);
        paths.push(`/partials${path}.ejs`);
        paths.push(`${path}.ejs`);
        paths.push(`${path.replace(req.path, '')}/pages${path}.ejs`);
        paths.push(`${path.replace(req.path, '')}/partials${path}.ejs`);
        paths.push(`/pages${path}.html`);
        paths.push(`/partials${path}.html`);
        paths.push(`${path}.html`);
        paths.push(`${path.replace(req.path, '')}/pages${path}.html`);
        paths.push(`${path.replace(req.path, '')}/partials${path}.html`);
        return paths;
    }
}
exports.default = new Responder();
