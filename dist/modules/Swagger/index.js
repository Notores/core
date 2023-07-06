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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotoresBaseSwaggerDocModule = void 0;
const Notores_1 = require("../../types/Notores");
const decorators_1 = require("../../decorators");
const swagger_ui_express_1 = require("swagger-ui-express");
const Notores_2 = require("../../Notores");
Notores_2.NotoresApplication.app.on('listening', () => {
    Notores_2.NotoresApplication.app.apps.public.preMiddleware.use('/swagger-docs', (req, res, next) => {
        const swaggerDoc = req.notores.swaggerRegistry.toDOC();
        // @ts-ignore
        req.swaggerDoc = swaggerDoc;
        next();
    }, swagger_ui_express_1.serve);
});
let NotoresBaseSwaggerDocModule = class NotoresBaseSwaggerDocModule {
    serveSwaggerSetup(notores, config, req, res, next) {
        (0, swagger_ui_express_1.setup)(null, config.swagger)(req, res, next);
    }
};
__decorate([
    (0, decorators_1.SwaggerHideRoute)(),
    (0, decorators_1.Get)(),
    __param(0, decorators_1.NApp),
    __param(1, decorators_1.NConfig),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Notores_1.Notores.Application, Object, Object, Object, Function]),
    __metadata("design:returntype", void 0)
], NotoresBaseSwaggerDocModule.prototype, "serveSwaggerSetup", null);
NotoresBaseSwaggerDocModule = __decorate([
    (0, decorators_1.Module)({
        swaggerTag: false,
        prefix: '/swagger-docs'
    })
], NotoresBaseSwaggerDocModule);
exports.NotoresBaseSwaggerDocModule = NotoresBaseSwaggerDocModule;
