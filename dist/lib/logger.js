import { createLogger, format, transports } from "winston";
import path from "path";
import moment from "moment";
const { combine, timestamp, label, printf } = format;
const getLabel = function (callingModule) {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop() || '');
};
const myFormat = printf((info) => {
    return `${moment(info.timestamp).format('YYYY-MM-DD HH:mm:sss')} [${info.label}] ${info.level}: ${info.message}`;
});
export function loggerFactory(callingModule) {
    return createLogger({
        format: combine(label({ label: typeof callingModule === 'string' ? callingModule : getLabel(callingModule) }), timestamp(), myFormat),
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({ filename: 'logs/info.log', level: 'info' }),
            new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
            new transports.File({ filename: 'logs/notores.log' }),
        ]
    });
}
export function moduleLoggerFactory(moduleName) {
    return createLogger({
        format: combine(label({ label: typeof moduleName === 'string' ? moduleName : getLabel(moduleName) }), timestamp(), myFormat),
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({ filename: 'logs/info.log', level: 'info' }),
            new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
            new transports.File({ filename: 'logs/notores.log' }),
        ]
    });
}
export function systemLoggerFactory(loggerLabel) {
    return createLogger({
        format: combine(label({ label: typeof loggerLabel === 'string' ? loggerLabel : getLabel(loggerLabel) }), timestamp(), myFormat),
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({ filename: 'logs/info.log', level: 'info' }),
            new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
            new transports.File({ filename: 'logs/notores.log' }),
        ]
    });
}
