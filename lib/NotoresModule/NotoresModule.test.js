const NotoresModule = require('./NotoresModule');

describe('lib/NotoresModule', () => {
    let mod;

    beforeEach(() => {
        mod = new NotoresModule();
    });

    it('Should start with initialized as false', () => {
        expect(mod.initialized).toBeFalsy();
    });

    it('Should start with models as an empty object', () => {
        expect(Object.keys(mod.models).length === 0).toBeTruthy();
    });

    it('Should add a model to the models object', () => {
        const obj = {modelName: 'TestModel'};
        mod.setModel(obj.modelName, obj);

        expect(mod.models).toHaveProperty(obj.modelName, obj);
    });

    describe('init', () => {
        it('Should set initialized to "true"', () => {
            mod.init();
            expect(mod.initialized).toBeTruthy();
        });
    });
});