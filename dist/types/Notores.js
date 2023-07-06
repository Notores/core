"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notores = void 0;
const node_events_1 = __importDefault(require("node:events"));
var Notores;
(function (Notores) {
    class Responder {
    }
    Notores.Responder = Responder;
    class Application extends node_events_1.default {
        static get app() {
            return this._app;
        }
        static create(modules) {
            return __awaiter(this, void 0, void 0, function* () {
                return;
            });
        }
    }
    Notores.Application = Application;
    class Locals {
    }
    Notores.Locals = Locals;
})(Notores = exports.Notores || (exports.Notores = {}));
