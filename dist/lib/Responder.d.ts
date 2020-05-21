import { NextFunction, Request, Response } from "express";
declare class Responder {
    responseHandler: (req: Request, res: Response, next: NextFunction) => Promise<void> | undefined;
    jsonResponder: (req: Request, res: Response, next: NextFunction) => void;
    htmlResponder: (req: Request, res: Response) => Promise<void>;
    private render;
    private validateThemePaths;
    private getThemePaths;
    private genPaths;
    serverStatic: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private generatePaths;
    private getFullThemeDir;
    private getThemeDir;
}
declare const _default: Responder;
export default _default;
//# sourceMappingURL=Responder.d.ts.map