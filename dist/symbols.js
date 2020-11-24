"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiParameterMetadataKey = exports.middlewareMetadataKey = exports.apiMetadataKey = exports.connectionManagerMetadataKey = exports.connectionMetadataKey = exports.repositoryMetadataKey = exports.modelMetadataKey = exports.entityMetadataKey = void 0;
/*****************************
 ******* DATABASE KEYS *******
 *****************************/
exports.entityMetadataKey = Symbol("dbEntity");
exports.modelMetadataKey = Symbol("dbModel");
exports.repositoryMetadataKey = Symbol("dbRepository");
exports.connectionMetadataKey = Symbol("dbConnection");
exports.connectionManagerMetadataKey = Symbol("dbConnectionManager");
/*****************************
 ******* API KEYS *******
 *****************************/
exports.apiMetadataKey = Symbol('apiMetadataKey');
exports.middlewareMetadataKey = Symbol('middlewareMetadataKey');
exports.apiParameterMetadataKey = Symbol('apiParameterMetadataKey');
