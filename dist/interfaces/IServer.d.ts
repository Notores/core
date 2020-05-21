import { Application } from 'express';
import { IRouter } from "express-serve-static-core";
export interface IServer {
    main: Application;
    system: Application;
    preMiddleware: Application;
    public: {
        main: Application;
        preMiddleware: Application;
        router: IRouter;
        postMiddleware: Application;
    };
    private: {
        main: Application;
        preMiddleware: Application;
        router: IRouter;
        postMiddleware: Application;
    };
}
//# sourceMappingURL=IServer.d.ts.map