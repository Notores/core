const mongoose = require('mongoose');
const MongoSchema = require('./MongoSchema');

describe('MongoSchema', () => {
    let mongoModel;
    let schema = new mongoose.Schema(...require('./mongooseTestSchema'));

    beforeEach(() => {
        mongoModel = new MongoSchema('KH-Character', schema);
    });

    describe('deleteModel', () => {
        let originalDeleteModel;

        beforeAll(() => {
            originalDeleteModel = mongoose.deleteModel;
            mongoose.deleteModel = jest.fn();
        });

        afterAll(() => {
            mongoose.deleteModel = originalDeleteModel;
        });

        it('Should call mongoose.deleteModel with it\'s own modelname', () => {
             mongoModel.deleteModel();

             expect(mongoose.deleteModel).toHaveBeenCalledTimes(1);
             expect(mongoose.deleteModel).toHaveBeenCalledWith(mongoModel.modelName);
        });
    });

    describe('reloadModel', () => {
        let protoDeleteModel;
        let protoLoadModel;


    });

    describe('updateWhiteList', () => {
        const mongoModel = new MongoSchema('KH-Character', schema);

        it('Should add given property to the whitelist', () => {
            const property = 'hearts';
            mongoModel.updateWhitelist('get', property);
            expect(mongoModel.whitelist.get.includes(property)).toBeTruthy;
        });

        it('Should add given properties to the whitelist', () => {
            const properties = ['AP', 'muney'];
            mongoModel.updateWhitelist('get', properties);
            expect(mongoModel.whitelist.get.includes(properties)).toBeTruthy;
        });

        it('Should remove given property from the whitelist', () => {
            const property = 'hearts';
            mongoModel.updateWhitelist('get', property, false);
            expect(mongoModel.whitelist.get.includes(property)).toBeFalsy;
        });

        it('Should remove given properties from the whitelist', () => {
            const properties = ['muney', 'AP'];
            mongoModel.updateWhitelist('get', properties, false);
            mongoModel.updateWhitelist('get', 'noBody');
            expect(mongoModel.whitelist.get.includes(properties)).toBeFalsy;
        });
    })

});
