import { NextFunction, Request, Response } from "express";
import { Locals } from './Locals';
declare class Responder {
    responseHandler: (req: Request, res: Response, next: NextFunction) => Promise<void> | undefined;
    jsonResponder: (req: Request, res: Response, next: NextFunction) => void;
    htmlResponder: (req: Request, res: Response) => Promise<void>;
    render: (path: string, data: Locals) => Promise<string>;
    private validateThemePaths;
    private getThemePaths;
    private genPaths;
    private static createPathsGroup;
    serverStatic: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private generatePaths;
    private getFullThemeDir;
    private getThemeDir;
}
declare const _default: Responder;
export default _default;
//# sourceMappingURL=Responder.d.ts.map