const {writeFileSync, unlinkSync} = require('fs');
const {join} = require('path');
const notoresJson = require('../config/notores.test.json');

const root = process.cwd();

function writeNotoresConfig(dataString) {
    writeFileSync(join(root, 'notores.json'), dataString);
}

function unlinkNotoresConfig() {
    unlinkSync(join(root, 'notores.json'));
}

describe('lib/config', () => {

    const configLib = require('../config');

    afterAll(() => {
        unlinkNotoresConfig();
    });

    describe('getConfig', () => {
        describe('fail', () => {
            it('Should return an error if no config is found', () => {
                const result = configLib.getConfig();
                expect(result).toHaveProperty('error');
                expect(result.error.indexOf('ENOENT') > -1).toBeTruthy();
            });

            it('Should return an error if the JSON is not correctly formatted', () => {
                let result;
                writeNotoresConfig(JSON.stringify(notoresJson).slice(0, -3));
                result = configLib.getConfig();
                expect(result.error.indexOf('Unexpected end of JSON') > -1).toBeTruthy();

                writeNotoresConfig(notoresJson.toString());
                result = configLib.getConfig();
                expect(result.error.indexOf('Unexpected token') > -1).toBeTruthy();
            });
        });

        describe('success', () => {

            beforeAll(() => {
                writeNotoresConfig(JSON.stringify(notoresJson, null, 4));
            });

            it('Should return the notores.json file contents', () => {
                const result = configLib.getConfig();
                expect(result).toEqual(notoresJson);
            });

            it('Should return the content of the specified key', () => {
                const key = 'main';
                const result = configLib.getConfig(key);
                expect(result).toEqual(notoresJson[key]);
            })
        });

    });

    describe('getPackage', () => {
        describe('success', () => {
            it('Should return the package.json file contents', () => {
                const result = configLib.getPackage();
                expect(result).toHaveProperty('name', '@notores/core');
            });

            it('Should return the content of the specified key', () => {
                const key = 'name';
                const result = configLib.getPackage(key);
                expect(result).toEqual('@notores/core');
            });
        });
    });

});
