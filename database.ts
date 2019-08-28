const mongo = require('./lib/database/mongoose');
const {getModule} = require('./ModuleHandler');
const logger = require('./logger')(module);

let database: any;

export function selectDatabase(): any {
    switch ((process.env.DBMS || 'mongodb').toLowerCase()) {
        case 'mssql': {
            const db = getModule('@notores/mssql');
            if (db.installed) {
                return database = db;
            } else {
                return {error: 'Module for mssql not installed.'};
            }
        }
        case 'mysql': {
            const db = getModule('@notores/mysql');
            if (db.installed) {
                return database = db;
            } else {
                return {error: 'Module for mysql not installed.'};
            }
        }
        default:
            return database = mongo;
    }
}

export async function connect(): Promise<any> {
    const db = selectDatabase();
    if (db.error) {
        logger.error(db.error);
        throw new Error(db.error);
    }
    await db.connect();
    return db;
}

export function getConnection(): any {
    return database
}