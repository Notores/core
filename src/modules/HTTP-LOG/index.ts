import {Request, Response} from "express";
import {Module, Use} from "../../decorators";
import {systemLoggerFactory} from "../../lib";

const logger = systemLoggerFactory('@notores/core - HTTP response');

@Module({
    swaggerTag: false
})
export class NotoresBaseRequestLogger {

    @Use()
    logger(req: Request, res: Response) {
        const startTime = new Date();

        res.on('close', () => {
            const finishTime = new Date();
            // @ts-ignore
            const diffTime = Math.abs(finishTime - startTime);

            const logResponse = res.locals.hasError ? `Error ${res.locals.statusCode}` : `Success ${res.locals.statusCode}`;

            logger.info(`HTTP response - (${logResponse}):  ${req.method}:${req.originalUrl} (${diffTime} ms)`);
            if (res.locals.hasError)
                logger.error(`HTTP error - ${res.locals.error}`);
        })

    }

}
