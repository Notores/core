const routeUtils = require('./../../lib/routeUtils');

describe('RouteUtils', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {

        };
        res = {

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

});

