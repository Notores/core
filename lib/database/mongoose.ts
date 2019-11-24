import {MongooseConfig, StringKeyObject} from "../../Types";
import mongoose, {Mongoose} from "mongoose";
import Fawn from "fawn";
import {initLogger} from "../../logger";

import mongoUriBuilder from "mongo-uri-builder";

const logger = initLogger(module);

let connection : Mongoose;

function generateConnectionString(config : MongooseConfig = {user: '', pass: '', host: '', port: '', database: ''}, options : StringKeyObject = {}) {

    const mongoConfig = {
        username: config.user || process.env.DB_USER,
        password: config.pass || process.env.DB_PASS,
        host: config.host || process.env.DB_HOST,
        port: config.port || process.env.DB_PORT,
        database: config.database || process.env.DB_DB,
        options: {...options}
    };

    if (process.env.DB_AUTHDB) {
        mongoConfig.options.authSource = process.env.DB_AUTHDB;
    }
    const connectionString : string = mongoUriBuilder(mongoConfig);
    if (process.env.NODE_ENV !== 'production') {
        logger.info(`MongoDB Connection string: ${connectionString}`);
    }
    return connectionString;
}

async function connect(connectionString : string) {
    try {
        connection = await mongoose.connect(connectionString || generateConnectionString(), {useNewUrlParser: true});
        logger.info('Database connection successful');
        Fawn.init(mongoose);
    } catch (e) {
        logger.error(`connection error: ${e.message}`);
    }
}

function getConnected() {
    if (!connection || !connection.connections)
        return {state: 0, readableState: 'non-initialized'};

    const connectionState = {
        state: connection.connections[0].readyState,
        readableState: connection.connections[0].states[connection.connections[0].readyState]
    };
    return connectionState
}

function getDatabase() {
    return connection;
}

function startTransaction() {
    return Fawn.Task();
}

module.exports = {
    connect,
    generateConnectionString,
    getConnected,
    getDatabase,
    startTransaction
};

