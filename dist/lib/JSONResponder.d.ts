import { Request, Response } from 'express';
import { MainResponder } from "./Responder";
export declare class JSONResponder extends MainResponder {
    _type: string;
    responder: (req: Request, res: Response) => Response<any, Record<string, any>>;
}
