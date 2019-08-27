"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo = require('./lib/database/mongoose');
const { getModule } = require('./ModuleHandler');
const logger = require('./logger')(module);
let database;
function selectDatabase() {
    switch ((process.env.DBMS || 'mongodb').toLowerCase()) {
        case 'mssql': {
            const db = getModule('@notores/mssql');
            if (db.installed) {
                return database = db;
            }
            else {
                return { error: 'Module for mssql not installed.' };
            }
        }
        case 'mysql': {
            const db = getModule('@notores/mysql');
            if (db.installed) {
                return database = db;
            }
            else {
                return { error: 'Module for mysql not installed.' };
            }
        }
        default:
            return database = mongo;
    }
}
exports.selectDatabase = selectDatabase;
async function connect() {
    const db = selectDatabase();
    if (db.error) {
        logger.error(db.error);
        throw new Error(db.error);
    }
    await db.connect();
    return db;
}
exports.connect = connect;
function getConnection() {
    return database;
}
exports.getConnection = getConnection;
