"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ModuleMetaData_prefix, _ModuleMetaData_responseIsBody, _ModuleMetaData_filePath, _ModuleMetaData_dataKey, _ModuleMetaData_entities, _ModuleMetaData_target, _ModuleMetaData_targetName, _ModuleMetaData_key, _ModuleMetaData_swaggerTag, _ModuleMetaData_entity, _ModuleMetaData_repository;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleMetaData = void 0;
const Notores_1 = require("../Notores");
class ModuleMetaData {
    constructor(target, filePath) {
        // Defaults
        _ModuleMetaData_prefix.set(this, '/');
        _ModuleMetaData_responseIsBody.set(this, false);
        _ModuleMetaData_filePath.set(this, '');
        _ModuleMetaData_dataKey.set(this, false);
        _ModuleMetaData_entities.set(this, []);
        // Constructor
        _ModuleMetaData_target.set(this, void 0);
        _ModuleMetaData_targetName.set(this, void 0);
        _ModuleMetaData_key.set(this, void 0);
        _ModuleMetaData_swaggerTag.set(this, void 0);
        // Optionals
        _ModuleMetaData_entity.set(this, void 0);
        _ModuleMetaData_repository.set(this, void 0);
        __classPrivateFieldSet(this, _ModuleMetaData_target, target, "f");
        __classPrivateFieldSet(this, _ModuleMetaData_filePath, filePath, "f");
        __classPrivateFieldSet(this, _ModuleMetaData_targetName, target.name, "f");
        __classPrivateFieldSet(this, _ModuleMetaData_key, this.targetName, "f");
        __classPrivateFieldSet(this, _ModuleMetaData_swaggerTag, {
            name: target.name.replace(/(Module|module)/, ''),
        }, "f");
    }
    setup() {
        if (__classPrivateFieldGet(this, _ModuleMetaData_entity, "f") || __classPrivateFieldGet(this, _ModuleMetaData_entities, "f")) {
            const arr = [];
            if (__classPrivateFieldGet(this, _ModuleMetaData_entity, "f")) {
                arr.push(__classPrivateFieldGet(this, _ModuleMetaData_entity, "f"));
                __classPrivateFieldGet(this, _ModuleMetaData_target, "f").prototype.entity = __classPrivateFieldGet(this, _ModuleMetaData_entity, "f");
            }
            if (__classPrivateFieldGet(this, _ModuleMetaData_entities, "f")) {
                arr.push(...__classPrivateFieldGet(this, _ModuleMetaData_entities, "f"));
                __classPrivateFieldGet(this, _ModuleMetaData_target, "f").prototype.entities = __classPrivateFieldGet(this, _ModuleMetaData_entities, "f");
            }
            const filtered = [...new Set(arr)];
            Notores_1.NotoresApplication.entities.push(filtered);
        }
        if (this.repository) {
            Notores_1.NotoresApplication.repositories.push(__classPrivateFieldGet(this, _ModuleMetaData_repository, "f"));
            __classPrivateFieldGet(this, _ModuleMetaData_target, "f").prototype.repoClazz = __classPrivateFieldGet(this, _ModuleMetaData_repository, "f");
            __classPrivateFieldGet(this, _ModuleMetaData_target, "f").prototype.repository = new (__classPrivateFieldGet(this, _ModuleMetaData_repository, "f"))();
        }
    }
    generateDataKeyName() {
        return __classPrivateFieldGet(this, _ModuleMetaData_target, "f").name.indexOf('Module') > -1 ? __classPrivateFieldGet(this, _ModuleMetaData_target, "f").name.replace('Module', '') : __classPrivateFieldGet(this, _ModuleMetaData_target, "f").name;
    }
    get key() {
        return __classPrivateFieldGet(this, _ModuleMetaData_key, "f");
    }
    set key(value) {
        __classPrivateFieldSet(this, _ModuleMetaData_key, value, "f");
    }
    get prefix() {
        return __classPrivateFieldGet(this, _ModuleMetaData_prefix, "f");
    }
    set prefix(value) {
        __classPrivateFieldSet(this, _ModuleMetaData_prefix, value.startsWith('/') ? value : `/${value}`, "f");
    }
    get responseIsBody() {
        return __classPrivateFieldGet(this, _ModuleMetaData_responseIsBody, "f");
    }
    set responseIsBody(value) {
        __classPrivateFieldSet(this, _ModuleMetaData_responseIsBody, value, "f");
        __classPrivateFieldSet(this, _ModuleMetaData_dataKey, value ? false : this.generateDataKeyName(), "f");
    }
    get filePath() {
        return __classPrivateFieldGet(this, _ModuleMetaData_filePath, "f");
    }
    set filePath(value) {
        __classPrivateFieldSet(this, _ModuleMetaData_filePath, value, "f");
    }
    get target() {
        return __classPrivateFieldGet(this, _ModuleMetaData_target, "f");
    }
    set target(value) {
        __classPrivateFieldSet(this, _ModuleMetaData_target, value, "f");
    }
    get repository() {
        return __classPrivateFieldGet(this, _ModuleMetaData_repository, "f");
    }
    set repository(value) {
        __classPrivateFieldSet(this, _ModuleMetaData_repository, value, "f");
    }
    get entities() {
        return __classPrivateFieldGet(this, _ModuleMetaData_entities, "f");
    }
    set entities(value) {
        __classPrivateFieldSet(this, _ModuleMetaData_entities, value, "f");
    }
    get entity() {
        return __classPrivateFieldGet(this, _ModuleMetaData_entity, "f");
    }
    set entity(value) {
        __classPrivateFieldSet(this, _ModuleMetaData_entity, value, "f");
    }
    get dataKey() {
        return __classPrivateFieldGet(this, _ModuleMetaData_responseIsBody, "f") ? false : __classPrivateFieldGet(this, _ModuleMetaData_dataKey, "f");
    }
    set dataKey(value) {
        __classPrivateFieldSet(this, _ModuleMetaData_dataKey, value, "f");
        if (value === false) {
            __classPrivateFieldSet(this, _ModuleMetaData_responseIsBody, true, "f");
        }
    }
    get targetName() {
        return __classPrivateFieldGet(this, _ModuleMetaData_targetName, "f");
    }
    set targetName(value) {
        __classPrivateFieldSet(this, _ModuleMetaData_targetName, value, "f");
    }
    get swaggerTag() {
        return __classPrivateFieldGet(this, _ModuleMetaData_swaggerTag, "f");
    }
    set swaggerTag(tag) {
        __classPrivateFieldSet(this, _ModuleMetaData_swaggerTag, tag, "f");
    }
}
exports.ModuleMetaData = ModuleMetaData;
_ModuleMetaData_prefix = new WeakMap(), _ModuleMetaData_responseIsBody = new WeakMap(), _ModuleMetaData_filePath = new WeakMap(), _ModuleMetaData_dataKey = new WeakMap(), _ModuleMetaData_entities = new WeakMap(), _ModuleMetaData_target = new WeakMap(), _ModuleMetaData_targetName = new WeakMap(), _ModuleMetaData_key = new WeakMap(), _ModuleMetaData_swaggerTag = new WeakMap(), _ModuleMetaData_entity = new WeakMap(), _ModuleMetaData_repository = new WeakMap();
