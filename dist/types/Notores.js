import EventEmitter from 'node:events';
export var Notores;
(function (Notores) {
    class Responder {
        _type;
    }
    Notores.Responder = Responder;
    class Application extends EventEmitter {
        static entities;
        static repositories;
        static _app;
        static get app() {
            return this._app;
        }
        static async create(modules) {
            return;
        }
        swaggerRegistry;
        modules;
        controllers;
        apps;
        server;
        connection;
        db;
        responders;
        registeredModules;
    }
    Notores.Application = Application;
    class Locals {
        _contentType;
        _body;
        _payload;
        _url;
        _path;
        _config;
        _user;
        _query;
        _accepts;
        _error;
        _statusCode;
        _authenticated;
        _NODE_ENV;
        _req;
        _res;
    }
    Notores.Locals = Locals;
})(Notores || (Notores = {}));
