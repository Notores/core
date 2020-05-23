"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const __2 = require("../..");
const moment_1 = __importDefault(require("moment"));
const winston_1 = require("winston");
const { combine, timestamp, printf } = winston_1.format;
const myFormat = printf((info) => {
    return `${moment_1.default(info.timestamp).format('YYYY-MM-DD HH:mm:sss')} ${info.message}`;
});
const logger = winston_1.createLogger({
    format: combine(
    // label({label: getLabel(callingModule)}),
    timestamp(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/info.log', level: 'info' }),
        new winston_1.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
        new winston_1.transports.File({ filename: 'logs/notores.log' }),
    ]
});
let RequestLogger = /** @class */ (() => {
    let RequestLogger = class RequestLogger {
        logger(req, res) {
            const startTime = new Date();
            res.on('close', () => {
                const finishTime = new Date();
                // @ts-ignore
                const diffTime = Math.abs(finishTime - startTime);
                const logResponse = res.locals.hasError ? `Error ${res.locals.error.status}` : 'success';
                logger.info(`HTTP response (${logResponse}):  ${req.method}:${req.originalUrl} (${diffTime} ms)`);
                if (!res.locals.hasError)
                    logger.error(`HTTP error: ${res.locals.error.message}`);
            });
        }
    };
    __decorate([
        __2.Use(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], RequestLogger.prototype, "logger", null);
    RequestLogger = __decorate([
        __1.Module()
    ], RequestLogger);
    return RequestLogger;
})();
exports.default = RequestLogger;
