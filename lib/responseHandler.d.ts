import {Request, Response} from 'express';

export function responseHandler(req: Request, res: Response): Promise<any>;

export function htmlResponder(req: Request, res: Response): Promise<any>;

export function jsonResponder(req: Request, res: Response): Promise<any>;
