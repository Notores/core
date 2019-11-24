"use strict";
const NotoresModule = require('./../../lib/NotoresModule');
class NotoresSharedModelsModule extends NotoresModule {
    init() {
        super.init();
        const Address = require('./models/address');
        this.setModel(Address.modelName, Address);
        const Coordinates = require('./models/coordinates');
        this.setModel(Coordinates.modelName, Coordinates);
    }
}
module.exports = new NotoresSharedModelsModule();
