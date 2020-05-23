import {Module} from "../..";
import {Use} from "../..";
import {Request, Response} from "express";
import moment from 'moment';
import {createLogger, format, transports} from "winston";

const {combine, timestamp, printf} = format;

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

            const logResponse = res.locals.hasError ? `Error ${res.locals.error.status}` : 'success';

            logger.info(`HTTP response (${logResponse}):  ${req.method}:${req.originalUrl} (${diffTime} ms)`);
            if (!res.locals.hasError)
                logger.error(`HTTP error: ${res.locals.error.message}`);
        })

    }

}
