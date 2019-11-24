"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotoresModule_1 = __importDefault(require("./../../lib/NotoresModule"));
class NotoresUserModule extends NotoresModule_1.default {
    init() {
        super.init();
        const userModel = require('./models/user');
        this.setModel(userModel.modelName, userModel);
        require('./passport');
        require('./routes');
    }
}
module.exports = new NotoresUserModule();
