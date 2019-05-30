const routeUtils = require('./../../lib/routeUtils');

describe('RouteUtils', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            isAuthenticated: jest.fn(() => true),
            params: {},
            body: {},
            session: {},
            logout: jest.fn(),
        };
        res = {
            status: jest.fn(),
            redirect: jest.fn(),
        };
        next = jest.fn();
    });

    describe('handleActive', () => {
        it('Should call "next(\'route\')" when the handle is not active or does not exist', () => {
            const middleware = routeUtils.handleActive('missing-handle');
            middleware(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith('route');
        });
    });

    describe('check', () => {
        test('Should convert the supplied argument to an array if it isn\'t', () => {
            req.params = {id: 12345};

            const middleware = routeUtils.checkInput({type: Number, key: 'id'});
            middleware(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        describe('Error', () => {
            test('Should call nextRoute when the supplied param is not a Number', () => {
                req.params.id = 'ABCDEF';
                const middleware = routeUtils.checkInput([{type: Number, key: 'id'}]);
                middleware(req, res, next);

                expect(next).toHaveBeenCalledTimes(1);
                expect(next).toHaveBeenCalledWith('route');
            });

            test('Should call nextRoute when the supplied param is not a String', () => {
                req.params.id = 12345;
                const middleware = routeUtils.checkInput([{type: String, key: 'id'}]);
                middleware(req, res, next);

                expect(next).toHaveBeenCalledTimes(1);
                expect(next).toHaveBeenCalledWith('route');
            });

            test('Should call nextRoute when the supplied param is not an Array', () => {
                req.params.id = 12345;
                const middleware = routeUtils.checkInput([{type: Array, key: 'id'}]);
                middleware(req, res, next);

                expect(next).toHaveBeenCalledTimes(1);
                expect(next).toHaveBeenCalledWith('route');
            });

            test('Should call nextRoute when the supplied body is not a Number', () => {
                req.body.id = 'ABCDEF';
                const middleware = routeUtils.checkInput([{type: Number, key: 'id'}], 'body');
                middleware(req, res, next);

                expect(next).toHaveBeenCalledTimes(1);
                expect(next).toHaveBeenCalledWith('route');
            });

            test('Should call nextRoute when the supplied body is not a String', () => {
                req.body.id = 12345;
                const middleware = routeUtils.checkInput([{type: String, key: 'id'}], 'body');
                middleware(req, res, next);

                expect(next).toHaveBeenCalledTimes(1);
                expect(next).toHaveBeenCalledWith('route');
            });

            test('Should call nextRoute when the supplied body is not an Array', () => {
                req.body.id = 12345;
                const middleware = routeUtils.checkInput([{type: Array, key: 'id'}], 'body');
                middleware(req, res, next);

                expect(next).toHaveBeenCalledTimes(1);
                expect(next).toHaveBeenCalledWith('route');
            });
        });

        describe('Success', () => {
            test('Should call next when the supplied params match', () => {
                req.params = {
                    id: 12345,
                    name: 'Test',
                    arr: [1, 2, 3, 4]
                };
                const middleware = routeUtils.checkInput([
                    {type: Number, key: 'id'},
                    {type: String, key: 'name'},
                    {type: Array, key: 'arr'}
                ]);
                middleware(req, res, next);

                expect(next).toHaveBeenCalledTimes(1);
                expect(next).not.toHaveBeenCalledWith('route');
            });

            test('Should call next when the supplied body matches', () => {
                req.body = {
                    id: 12345,
                    name: 'Test',
                    arr: [1, 2, 3, 4]
                };
                const middleware = routeUtils.checkInput([
                    {type: Number, key: 'id'},
                    {type: String, key: 'name'},
                    {type: Array, key: 'arr'}
                ], 'body');
                middleware(req, res, next);

                expect(next).toHaveBeenCalledTimes(1);
                expect(next).not.toHaveBeenCalledWith('route');
            });
        });
    });

});

