import {NextFunction, Request, Response} from "express";
import {join} from "path";
import {IThemeConfig} from "../namespace/Notores";
import {constants as fsConstants, promises} from 'fs';
import {Locals} from './Locals';
import * as ejs from 'ejs';

const {access, readFile} = promises;

class Responder {
    responseHandler = (req: Request, res: Response, next: NextFunction) => {
        if (res.locals.type === 'html') {
            return this.htmlResponder(req, res);
        } else {
            this.jsonResponder(req, res, next);
        }
    };

    jsonResponder = (req: Request, res: Response, next: NextFunction): void => {
        if (res.locals.error.status > 400 && res.locals.error.status < 600) {
            const error = res.locals.error;
            res.status(error.status);
            res.json({error: error.message instanceof Error ? error.message.message : error.message});
            return;
        }

        res.json(res.locals.toJSON());
    };

    htmlResponder = async (req: Request, res: Response) => {
        const path = await this.validateThemePaths(this.getThemePaths(req, res), req);

        let html = await this.render(path, res.locals);
        if (res.locals.isExtended) {
            const paths = this.genPaths(req, res.locals.extended.path).map(path => join(
                this.getFullThemeDir(req),
                path,
            ));
            const path = await this.validateThemePaths(paths, req);
            for(let key in res.locals.extended.data) {
                res.locals[key] = res.locals.extended.data[key]
            }
            res.locals.content = html;
            html = await this.render(path, res.locals)
        }

        res.send(html);
    };

    private render = async (path: string, data: Locals) => {
        const template = await readFile(path, 'utf-8');
        return ejs.render(template, data, {cache: false, filename: path});
    };

    private validateThemePaths = async (paths: string[], req: Request): Promise<string> => {
        for (let i = 0; i < paths.length; i++) {
            try {
                await access(paths[i], fsConstants.R_OK);
                return paths[i];
            } catch (e) {
                // console.log('Path NOT OK');
            }
        }
        return join(this.getThemeDir(req), 'pages', '404.ejs');
    };

    private getThemePaths = (req: Request, res: Response) => {
        const pages: string[] = [];
        if (res.locals.error.status > 400 && res.locals.error.status < 600) {
            pages.push(...this.genPaths(req, `/${res.locals.error.status}`));
            pages.push(...this.genPaths(req, `/500`));
        } else {
            res.locals.pages.forEach((page: string) => {
                console.log(this.genPaths(req, page));
                pages.push(...this.genPaths(req, page))
            });
            pages.push(
                ...this.genPaths(req, req.path)
            );
            if (req.path === '/') {
                pages.push(...this.genPaths(req, '/index'));
            }
        }
        pages.push(...this.genPaths(req, '/404'));

        const paths: string[] = [];
        const themeDir = join(process.cwd(), 'public', 'themes', this.getThemeDir(req));

        const localsLocations = res.locals.pageLocations;
        pages.forEach((page: string) => {
            paths.push(
                join(themeDir, page)
            );

            localsLocations.forEach((loc: string) => {
                paths.push(
                    join(loc, page)
                );
            });
        });
        return paths;
    }


    private genPaths(req: Request, path: string): string[] {
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

    serverStatic = async (req: Request, res: Response, next: NextFunction) => {
        if (req.notores.theme === false) {
            return next();
        }

        const paths = this.generatePaths(req);

        for(let path of paths) {
            if(path.indexOf('.html') > -1) {
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

        if(validatedPath.includes('404.ejs')) {
            return next();
        }

        res.sendFile(validatedPath, options, err => {
            if (err) {
                res.locals.error = {status: 500, message: err.message};
                return next();
            }
        });
    };

    private generatePaths = (req: Request) => {
        let url = req.url;
        if (req.url === '/')
            url = '/index';

        let urls = [url];
        urls.push(req.originalUrl.split(/[?#]/)[0]);

        const themeDir = this.getThemeDir(req);

        return urls.map((u: string) => {
            return join(process.cwd(), './public/themes', themeDir, u);
        });
    };

    private getFullThemeDir = (req: Request): string => join(
        process.cwd(),
        'public',
        'themes',
        this.getThemeDir(req)
    );

    private getThemeDir = (req: Request) => {
        const url = req.originalUrl;
        const themeConfig: IThemeConfig = req.notores.theme as IThemeConfig;

        if (url.indexOf('n-admin') === 0)
            return join(themeConfig.admin.name, 'admin');
        else
            return join(themeConfig.public.name, 'public');
    };
}

export default new Responder();
