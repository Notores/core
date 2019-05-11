const NotoresModule = require('./../../lib/NotoresModule');

class NotoresSharedModelsModule extends NotoresModule {

    init() {
        super.init();
        const Address = require('./models/address');
        this.setModel(Address.modelName, Address);
    }
}

module.exports = new NotoresSharedModelsModule();
