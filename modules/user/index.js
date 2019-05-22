const {NotoresModule} = require('@notores/core');

class NotoresUserModule extends NotoresModule {

    init() {
        super.init();

        const userModel = require('./models/user');
        this.setModel(userModel.modelName, userModel);

        require('./passport');
        require('./routes');
    }
}

module.exports = new NotoresUserModule();
