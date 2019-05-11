const ModuleHandler = require('./../ModuleHandler');

describe('ModuleHandler', () => {

    describe('getModulesList', () => {
        it('Should return an empty array before initialization', () => {
            const result = ModuleHandler.getModulesList();
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(0);
        });
    });

    describe('getModule', () => {
        it('Should return an object with "installed = false" when the required module is not loaded or does not exist', () => {
            const result = ModuleHandler.getModule('MyNonExistendAwesomeModule');
            expect(result).toHaveProperty('installed', false);
        });

        it('Should return the required module', () => {
            const result = ModuleHandler.getModule('./logger');

            expect(typeof result === "function").toBeTruthy();
        });

        it('Should have the property "installed" set to true if the module exists', () => {
            const result = ModuleHandler.getModule('./logger');

            expect(result).toHaveProperty('installed', true);
        });
    });

    describe('loadModule', () => {
        it('Should return an error if the module can\'t be loaded (e.g. doesn\'t exist)', () => {
            const result = ModuleHandler.loadModule('MyNonExistendAwesomeModule');
            expect(result).toHaveProperty('installed', false);
        });

        it('Should return the module if the module exists', () => {
            const result = ModuleHandler.loadModule('@notores/core/shared-models', './modules/shared-models');
            expect(result).toHaveProperty('installed', true);
        });

        it('Should return the module if it has already been registererd', () => {
            const result = ModuleHandler.loadModule('@notores/core/shared-models');
            expect(result).toHaveProperty('installed', true);
        });

        it('Should start from the rootDirectory if the module name starts with ":root"', () => {
            const result = ModuleHandler.loadModule('@notores/core/sharedmodels', ':root/modules/shared-models');
            expect(result).toHaveProperty('installed', true);
        });
    });
});