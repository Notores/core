describe('Locals', () => {
    const localsModule = require('./Locals');
    const Locals = localsModule.Locals;
    let local, req;

    beforeEach(() => {
        req = {
            isAuthenticated: jest.fn(() => false),
            query: {}
        };

        local = new Locals(req);
    });

    describe('Locals', () => {

        describe('static addProperty', () => {

            afterEach(() => {
                Locals.properties.length = 0;
            });

            it('Should add the supplied parameters to the static properties list', () => {
                const property = {key: 'foo', defaultValue: []};

                Locals.addProperty(property.key, property.defaultValue);

                const result = Locals.properties.find(obj => obj.key === property.key);
                expect(result).toHaveProperty('key', property.key);
                expect(result).toHaveProperty('defaultValue', property.defaultValue);
            });
        });

        describe('static defineProperty', () => {
            it('Should add the supplied object to the Locals prototype', () => {
                const obj = {
                    get() {
                        return this.user;
                    },
                    set(user) {
                        this.user = user;
                    },
                };
                Locals.defineProperty('me', obj);

                expect(local.me).toEqual(local.user);

                local.me = 'Username';
                expect(local.user).toEqual(local.me);
            });
        });

        describe('static extend', () => {
            it('Should add the supplied object to the Locals prototype', () => {
                const obj = {
                    foo: 'bar'
                };
                Locals.extend(obj);

                expect(local.foo).toEqual(obj.foo);
            });
        });

        describe('.env', () => {
            it('Should return a boolean if the supplied env is equal to the current', () => {
                const result = local.env(process.env.NODE_ENV);
                expect(result).toBeTruthy();
            });
        });

        describe('.setBody', () => {
            it('Should add the object to local.body', () => {
                const key = 'foo';
                const obj = {
                    [key]: 'value'
                };

                local.setBody(obj);

                expect(local.body).toHaveProperty(key, obj[key]);
            });

            it('Should not add the object to local.body if the key already exists', () => {
                const key = 'foo';
                const originalValue = 'value';
                const obj = {
                    [key]: originalValue
                };

                local.setBody(obj);
                obj[key] = 'wrong value';
                local.setBody(obj);

                expect(local.body).toHaveProperty(key, originalValue);
            });
        });

        describe('.bodyIsSet', () => {
            it('Should return true if there are keys and no body is given', () => {
                const key = 'foo';
                const obj = {
                    [key]: 'value'
                };
                local.setBody({...local.body, ...obj}, true);

                expect(local.bodyIsSet()).toBeTruthy();
            });
            it('Should return false if there are no keys and no body is given', () => {
                expect(local.bodyIsSet()).toBeFalsy();
            });

            it('Should return false if the key is not present', () => {
                const key = 'foo';
                const obj = {
                    [key]: 'value'
                };

                expect(local.bodyIsSet(obj)).toBeFalsy();
            });

            it('Should return true if the key is present', () => {
                const key = 'foo';
                const obj = {
                    [key]: 'value'
                };

                local.setBody({...local.body, ...obj}, true);

                expect(local.bodyIsSet(obj)).toBeTruthy();
            });
        });

        describe('.toJSON', () => {
            it('Should return a JSON object', () => {
                const result = local.toJSON();

                expect(result instanceof Locals).toBeFalsy();
            });

            it('Should be the locals body', () => {
                const key = 'foo';
                const obj = {
                    [key]: 'value'
                };
                local.setBody({...local.body, ...obj}, true);

                const result = local.toJSON();

                expect(result).toHaveProperty(key, obj[key]);
            });
        });
    });

    describe('Middleware', () => {
        let req;
        let res;

        beforeEach(() => {
            req = {
                isAuthenticated: jest.fn(() => false),
            };
            res = {
                locals: null
            };
        });

        it('Should set a new instance of Locals on res.locals', () => {
            localsModule(req, res, () => {
                expect(res.locals instanceof Locals).toBeTruthy();
            });
        });

        it('Should set authenticated to false is not authenticated', () => {
            localsModule(req, res, () => {
                expect(res.locals.authenticated).toBeFalsy()
            })
        });
        it('Should set authenticated to true if authenticated', () => {
            req.isAuthenticated = jest.fn(() => true);
            localsModule(req, res, () => {
                expect(res.locals.authenticated).toBeTruthy()
            })
        });
    });
});
