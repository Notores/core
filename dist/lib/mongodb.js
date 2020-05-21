"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notoresAddModelToTypegoose = exports.notoresModelForClass = exports.getDatabase = exports.getConnected = exports.connect = exports.generateConnectionString = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const logger_1 = __importDefault(require("./logger"));
const logger = logger_1.default(module);
let connection;
function generateConnectionString(config, options = {}) {
    const mongoUriBuilder = require('mongo-uri-builder');
    const mongoConfig = {
        username: (config === null || config === void 0 ? void 0 : config.user) || process.env.MONGO_USERNAME,
        password: (config === null || config === void 0 ? void 0 : config.password) || process.env.MONGO_PASSWORD,
        host: (config === null || config === void 0 ? void 0 : config.host) || process.env.MONGO_HOST,
        port: (config === null || config === void 0 ? void 0 : config.port) || process.env.MONGO_PORT,
        database: (config === null || config === void 0 ? void 0 : config.database) || process.env.MONGO_DB,
        options: { ...options }
    };
    if ((config === null || config === void 0 ? void 0 : config.authSource) || process.env.MONGO_AUTH) {
        mongoConfig.options.authSource = (config === null || config === void 0 ? void 0 : config.authSource) || process.env.MONGO_AUTH;
    }
    const connectionString = mongoUriBuilder(mongoConfig);
    if (process.env.NODE_ENV !== 'production') {
        logger.info(`MongoDB Connection string: ${connectionString}`);
    }
    return connectionString;
}
exports.generateConnectionString = generateConnectionString;
async function connect(connectionString) {
    try {
        connection = await typegoose_1.mongoose.connect(connectionString || generateConnectionString(), { useNewUrlParser: true });
        logger.info('Database connection successful');
        return connection;
    }
    catch (e) {
        logger.error(`connection error: ${e.message}`);
        return e;
    }
}
exports.connect = connect;
function getConnected() {
    if (!connection || !connection.connections)
        return { state: 0, readableState: 'non-initialized' };
    const connectionState = {
        state: connection.connections[0].readyState,
        readableState: connection.connections[0].states[connection.connections[0].readyState]
    };
    return connectionState;
}
exports.getConnected = getConnected;
function getDatabase() {
    return connection;
}
exports.getDatabase = getDatabase;
function notoresModelForClass(clazz) {
    // @ts-ignore
    const Mod = typegoose_1.getModelForClass(clazz);
    Mod.whitelist = {
        get: []
    };
    Mod.updateWhitelist = (key, fields, add = true) => {
        if (!Array.isArray(fields)) {
            fields = [fields];
        }
        if (add) {
            if (!Mod.whitelist.hasOwnProperty(key))
                Mod.whitelist[key] = [];
            Mod.whitelist[key].push(...fields);
        }
        else {
            fields.forEach(field => {
                while (Mod.whitelist[key].includes(field)) {
                    Mod.whitelist[key].splice(Mod.whitelist[key].indexOf(field), 1);
                }
            });
        }
    };
    return Mod;
}
exports.notoresModelForClass = notoresModelForClass;
function notoresAddModelToTypegoose(model, cl, oldModel) {
    // @ts-ignore
    const Mod = typegoose_1.addModelToTypegoose(model, cl);
    Mod.whitelist = oldModel.whitelist;
    Mod.updateWhitelist = (key, fields, add = true) => {
        if (!Array.isArray(fields)) {
            fields = [fields];
        }
        if (add) {
            if (!Mod.whitelist.hasOwnProperty(key))
                Mod.whitelist[key] = [];
            Mod.whitelist[key].push(...fields);
        }
        else {
            fields.forEach(field => {
                while (Mod.whitelist[key].includes(field)) {
                    Mod.whitelist[key].splice(Mod.whitelist[key].indexOf(field), 1);
                }
            });
        }
    };
    return Mod;
}
exports.notoresAddModelToTypegoose = notoresAddModelToTypegoose;
