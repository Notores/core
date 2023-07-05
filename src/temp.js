const express = require('express');

const  apps = {
    main: express(),
    system: express.Router(),
    auth: express.Router(),
    preMiddleware: express.Router(),
    public: {
        main: express.Router(),
        preMiddleware: express.Router(),
        router: express.Router(),
        postMiddleware: express.Router(),
        responders: express.Router(),
    },
    restricted: {
        main: express.Router(),
        preMiddleware: express.Router(),
        router: express.Router(),
        postMiddleware: express.Router(),
        responders: express.Router(),
    },
    errorResponders: express.Router(),
};

function genMiddlewareWithCountAndText(number, text = '') {
    return (req, res, next) => {
        console.log(`${number} - ${text}`, req.path);
        next();
    }
}

/** main **/
apps.main.use(genMiddlewareWithCountAndText(1, 'main.use'))

/** system **/
apps.main.use(apps.system);
apps.system.use(genMiddlewareWithCountAndText(2, 'system.use'))
apps.main.use(genMiddlewareWithCountAndText(3, 'main.use after system'));

/** auth **/
apps.main.use(apps.auth);
apps.auth.use(genMiddlewareWithCountAndText(4, 'auth.use'))
apps.main.use(genMiddlewareWithCountAndText(5, 'main.use after auth'));

/** preMiddleware **/
apps.main.use(apps.preMiddleware);
apps.preMiddleware.use(genMiddlewareWithCountAndText(6, 'preMiddleware.use'))
apps.main.use(genMiddlewareWithCountAndText(7, 'main.use after auth'));

/** public **/
apps.main.use(apps.public.main);
apps.public.main.use(genMiddlewareWithCountAndText(8, 'public.main.use'))

/** public sub router setup **/
apps.public.main.use(apps.public.preMiddleware);
apps.public.main.use(apps.public.router);
apps.public.main.use(apps.public.postMiddleware);
apps.public.main.use(apps.public.responders);

/** public-preMiddleware **/
apps.public.preMiddleware.use(genMiddlewareWithCountAndText(9, 'public.preMiddleware.use'))
apps.public.preMiddleware.use((req, res, next) => {
    console.log('10 - testing something');
    next();
})
/** public-router **/
apps.public.router.use(genMiddlewareWithCountAndText(11, 'public.router.use'))
/** public-router set locals body **/
apps.public.router.get('/', (req, res, next) => {
    console.log('12 - public.router.get')
    res.locals.body = {foo: 'bar'};
    next();
});
/** public-postMiddleware **/
apps.public.postMiddleware.use(genMiddlewareWithCountAndText(13, 'public.postMiddleware.use'))
apps.public.responders.use((req, res, next) => {
    if(res.locals.body && Object.keys(res.locals.body).length > 0) {
        return res.send({
            ...res.locals.body,
            baz: 'qux'
        });
    }
    next();
})

apps.main.use(genMiddlewareWithCountAndText(14, 'main.use after public'));

apps.main.use((req, res) => {
    console.log('res.headersSent', res.headersSent);
    if(res.headersSent) return;
    res.send('Final responder');
})


apps.main.listen(3000);

for(let i = 0; i < 20; i++) {
    console.log()
}