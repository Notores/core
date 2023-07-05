"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemLoggerFactory = exports.moduleLoggerFactory = exports.loggerFactory = void 0;
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
const { combine, timestamp, label, printf } = winston_1.format;
const getLabel = function (callingModule) {
    const parts = callingModule.filename.split(path_1.default.sep);
    return path_1.default.join(parts[parts.length - 2], parts.pop() || '');
};
const myFormat = printf((info) => {
    return `${moment_1.default(info.timestamp).format('YYYY-MM-DD HH:mm:sss')} [${info.label}] ${info.level}: ${info.message}`;
});
function loggerFactory(callingModule) {
    return winston_1.createLogger({
        format: combine(label({ label: getLabel(callingModule) }), timestamp(), myFormat),
        transports: [
            new winston_1.transports.Console(),
            new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston_1.transports.File({ filename: 'logs/info.log', level: 'info' }),
            new winston_1.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
            new winston_1.transports.File({ filename: 'logs/notores.log' }),
        ]
    });
}
exports.loggerFactory = loggerFactory;
function moduleLoggerFactory(moduleName) {
    return winston_1.createLogger({
        format: combine(label({ label: moduleName }), timestamp(), myFormat),
        transports: [
            new winston_1.transports.Console(),
            new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston_1.transports.File({ filename: 'logs/info.log', level: 'info' }),
            new winston_1.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
            new winston_1.transports.File({ filename: 'logs/notores.log' }),
        ]
    });
}
exports.moduleLoggerFactory = moduleLoggerFactory;
function systemLoggerFactory(loggerLabel) {
    return winston_1.createLogger({
        format: combine(label({ label: loggerLabel }), timestamp(), myFormat),
        transports: [
            new winston_1.transports.Console(),
            new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston_1.transports.File({ filename: 'logs/info.log', level: 'info' }),
            new winston_1.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
            new winston_1.transports.File({ filename: 'logs/notores.log' }),
        ]
    });
}
exports.systemLoggerFactory = systemLoggerFactory;
