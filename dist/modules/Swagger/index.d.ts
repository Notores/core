import { Notores } from "../../types/Notores";
import { NextFunction, Request, Response } from "express";
export declare class NotoresBaseSwaggerDocModule {
    serveSwaggerSetup(notores: Notores.Application, config: Notores.Config, req: Request, res: Response, next: NextFunction): void;
}
