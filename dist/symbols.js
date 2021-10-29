"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiParameterMetadataKey = exports.middlewareMetadataKey = exports.apiMetadataKey = exports.moduleMetadataKey = exports.connectionManagerMetadataKey = exports.connectionMetadataKey = exports.repositoryMetadataKey = exports.modelMetadataKey = exports.entityMetadataKey = void 0;
/*****************************
 ******* DATABASE KEYS *******
 *****************************/
exports.entityMetadataKey = Symbol("notores-dbEntity");
exports.modelMetadataKey = Symbol("notores-dbModel");
exports.repositoryMetadataKey = Symbol("notores-dbRepository");
exports.connectionMetadataKey = Symbol("notores-dbConnection");
exports.connectionManagerMetadataKey = Symbol("notores-dbConnectionManager");
/*****************************
 ******* API KEYS *******
 *****************************/
exports.moduleMetadataKey = Symbol('notores-moduleKey');
exports.apiMetadataKey = Symbol('notores-apiMetadataKey');
exports.middlewareMetadataKey = Symbol('notores-middlewareMetadataKey');
exports.apiParameterMetadataKey = Symbol('notores-apiParameterMetadataKey');
/*****************************
 ******* LOCALS KEYS *******
 *****************************/
