import {createLogger, format, transports, Logger} from "winston";
import path from "path";
import moment from "moment";
import Module = NodeJS.Module;

const {combine, timestamp, label, printf} = format;

const getLabel = function (callingModule: Module) {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop() || '');
};

const myFormat = printf((info: any) => {
    return `${moment(info.timestamp).format('YYYY-MM-DD HH:mm:sss')} [${info.label}] ${info.level}: ${info.message}`;
});

export function loggerFactory(callingModule: Module): Logger {
    return createLogger({
        format: combine(
            label({label: getLabel(callingModule)}),
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
}

export function moduleLoggerFactory(moduleName: string): Logger {
    return createLogger({
        format: combine(
            label({label: moduleName}),
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
}

export function systemLoggerFactory(loggerLabel: string): Logger {
    return createLogger({
        format: combine(
            label({label: loggerLabel}),
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
}
