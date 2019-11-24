"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fawn_1 = __importDefault(require("fawn"));
const logger_1 = require("../../logger");
const mongo_uri_builder_1 = __importDefault(require("mongo-uri-builder"));
const logger = logger_1.initLogger(module);
let connection;
function generateConnectionString(config = { user: '', pass: '', host: '', port: '', database: '' }, options = {}) {
    const mongoConfig = {
        username: config.user || process.env.DB_USER,
        password: config.pass || process.env.DB_PASS,
        host: config.host || process.env.DB_HOST,
        port: config.port || process.env.DB_PORT,
        database: config.database || process.env.DB_DB,
        options: { ...options }
    };
    if (process.env.DB_AUTHDB) {
        mongoConfig.options.authSource = process.env.DB_AUTHDB;
    }
    const connectionString = mongo_uri_builder_1.default(mongoConfig);
    if (process.env.NODE_ENV !== 'production') {
        logger.info(`MongoDB Connection string: ${connectionString}`);
    }
    return connectionString;
}
async function connect(connectionString) {
    try {
        connection = await mongoose_1.default.connect(connectionString || generateConnectionString(), { useNewUrlParser: true });
        logger.info('Database connection successful');
        fawn_1.default.init(mongoose_1.default);
    }
    catch (e) {
        logger.error(`connection error: ${e.message}`);
    }
}
function getConnected() {
    if (!connection || !connection.connections)
        return { state: 0, readableState: 'non-initialized' };
    const connectionState = {
        state: connection.connections[0].readyState,
        readableState: connection.connections[0].states[connection.connections[0].readyState]
    };
    return connectionState;
}
function getDatabase() {
    return connection;
}
function startTransaction() {
    return fawn_1.default.Task();
}
module.exports = {
    connect,
    generateConnectionString,
    getConnected,
    getDatabase,
    startTransaction
};
