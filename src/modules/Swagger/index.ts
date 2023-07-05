import {Notores} from "../../types/Notores";
import {Get, Module, NApp, NConfig, SwaggerHideRoute} from "../../decorators";
import {NextFunction, Request, Response} from "express";
import {serve, setup} from 'swagger-ui-express';
import {NotoresApplication} from "../../Notores";

NotoresApplication.app.on('listening', () => {
    NotoresApplication.app.apps.public.preMiddleware.use(
        '/swagger-docs',
        (req: Request, res: Response, next: NextFunction) => {
            const swaggerDoc = req.notores.swaggerRegistry.toDOC();
            // @ts-ignore
            req.swaggerDoc = swaggerDoc

            next();
        },
        serve
    )
})

@Module({
    swaggerTag: false,
    prefix: '/swagger-docs'
})
export class NotoresBaseSwaggerDocModule {

    @SwaggerHideRoute()
    @Get()
    serveSwaggerSetup(@NApp notores: Notores.Application, @NConfig config: Notores.Config, req: Request, res: Response, next: NextFunction) {
        setup(null, config.swagger)(req, res, next);
    }
}