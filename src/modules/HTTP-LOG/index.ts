import {Module} from "../../index";
import { Use } from "../../decorators/Middleware";
import {Request, Response} from "express";
import loggerFactory from "../../lib/logger";
import moment from 'moment';
import {createLogger, format, transports} from "winston";
import path from "path";
const {combine, timestamp, label, printf} = format;

//
// const getLabel = function (callingModule: Module) {
//     const parts = callingModule.filename.split(path.sep);
//     return path.join(parts[parts.length - 2], parts.pop() || '');
// };

const myFormat = printf((info: any) => {
    return `${moment(info.timestamp).format('YYYY-MM-DD HH:mm:sss')} ${info.message}`;
});


const logger = createLogger({
    format: combine(
        // label({label: getLabel(callingModule)}),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: 'logs/error.log', level: 'error'}),
        new transports.File({filename: 'logs/info.log', level: 'info'}),
        new transports.File({filename: 'logs/warn.log', level: 'warn'}),
        new transports.File({filename: 'logs/notores.log'}),
    ]
});

@Module()
export default class RequestLogger {


    @Use()
    logger(req: Request, res: Response) {
        const startTime = new Date();

        res.on('close', () => {
            const finishTime = new Date();
            // @ts-ignore
            const diffTime = Math.abs(finishTime - startTime);

            const success = res.locals.error.status === 0;

            logger.info(`HTTP response:  ${req.method}:${req.originalUrl} (${diffTime} ms)`);
        })

    }

}
