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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotoresBaseRequestLogger = void 0;
const decorators_1 = require("../../decorators");
const lib_1 = require("../../lib");
const logger = (0, lib_1.systemLoggerFactory)('@notores/core - HTTP response');
let NotoresBaseRequestLogger = class NotoresBaseRequestLogger {
    logger(req, res) {
        const startTime = new Date();
        res.on('close', () => {
            const finishTime = new Date();
            // @ts-ignore
            const diffTime = Math.abs(finishTime - startTime);
            const logResponse = res.locals.hasError ? `Error ${res.locals.statusCode}` : `Success ${res.locals.statusCode}`;
            logger.info(`HTTP response - (${logResponse}):  ${req.method}:${req.originalUrl} (${diffTime} ms)`);
            if (res.locals.hasError)
                logger.error(`HTTP error - ${res.locals.error}`);
        });
    }
};
__decorate([
    (0, decorators_1.Use)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], NotoresBaseRequestLogger.prototype, "logger", null);
NotoresBaseRequestLogger = __decorate([
    (0, decorators_1.Module)({
        swaggerTag: false
    })
], NotoresBaseRequestLogger);
exports.NotoresBaseRequestLogger = NotoresBaseRequestLogger;
