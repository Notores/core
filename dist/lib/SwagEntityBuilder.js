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
var _SwagEntityBuilder_entity, _SwagEntityBuilder_name, _SwagEntityBuilder_properties, _SwagEntityBuilder_required;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwagEntityBuilder = void 0;
const SwaggerHelpers_1 = require("./SwaggerHelpers");
class SwagEntityBuilder {
    constructor(entity) {
        _SwagEntityBuilder_entity.set(this, void 0);
        _SwagEntityBuilder_name.set(this, void 0);
        _SwagEntityBuilder_properties.set(this, {});
        _SwagEntityBuilder_required.set(this, []);
        __classPrivateFieldSet(this, _SwagEntityBuilder_entity, entity, "f");
        __classPrivateFieldSet(this, _SwagEntityBuilder_name, entity.name, "f");
    }
    get required() {
        return __classPrivateFieldGet(this, _SwagEntityBuilder_required, "f");
    }
    set required(value) {
        __classPrivateFieldSet(this, _SwagEntityBuilder_required, value, "f");
    }
    addRequired(property) {
        __classPrivateFieldGet(this, _SwagEntityBuilder_required, "f").push(property);
        return this;
    }
    get properties() {
        return __classPrivateFieldGet(this, _SwagEntityBuilder_properties, "f");
    }
    set properties(value) {
        __classPrivateFieldSet(this, _SwagEntityBuilder_properties, value, "f");
    }
    addProperty(key, property) {
        Object.assign(__classPrivateFieldGet(this, _SwagEntityBuilder_properties, "f"), { [key]: property });
        return this;
    }
    addRef(key, ref) {
        Object.assign(__classPrivateFieldGet(this, _SwagEntityBuilder_properties, "f"), { [key]: (0, SwaggerHelpers_1.generateRefObject)(ref) });
        return this;
    }
    addArrayRef(key, ref) {
        Object.assign(__classPrivateFieldGet(this, _SwagEntityBuilder_properties, "f"), {
            [key]: {
                type: 'array',
                items: (0, SwaggerHelpers_1.generateRefObject)(ref)
            }
        });
        return this;
    }
    addArrayProperty(key, options) {
        Object.assign(__classPrivateFieldGet(this, _SwagEntityBuilder_properties, "f"), {
            [key]: {
                type: 'array',
                items: options
            }
        });
        return this;
    }
    get name() {
        return __classPrivateFieldGet(this, _SwagEntityBuilder_name, "f");
    }
    set name(value) {
        __classPrivateFieldSet(this, _SwagEntityBuilder_name, value, "f");
    }
    get entity() {
        return __classPrivateFieldGet(this, _SwagEntityBuilder_entity, "f");
    }
    set entity(value) {
        __classPrivateFieldSet(this, _SwagEntityBuilder_entity, value, "f");
    }
    toDOC() {
        return {
            [__classPrivateFieldGet(this, _SwagEntityBuilder_name, "f")]: {
                type: "object",
                required: __classPrivateFieldGet(this, _SwagEntityBuilder_required, "f"),
                properties: __classPrivateFieldGet(this, _SwagEntityBuilder_properties, "f")
            }
        };
    }
}
exports.SwagEntityBuilder = SwagEntityBuilder;
_SwagEntityBuilder_entity = new WeakMap(), _SwagEntityBuilder_name = new WeakMap(), _SwagEntityBuilder_properties = new WeakMap(), _SwagEntityBuilder_required = new WeakMap();
