import { NextFunction, Request, Response } from 'express';
import { Notores } from "../types/Notores";
export declare function responseHandler(req: Request, res: Response): void;
export declare function errorResponseHandler(error: Error, req: Request, res: Response, next: NextFunction): void;
export declare class MainResponder extends Notores.Responder {
    _type: string;
    responder(req: Request, res: Response): void;
    get type(): string;
    set type(type: string);
}
