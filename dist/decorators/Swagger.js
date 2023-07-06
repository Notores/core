"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwagArrayProp = exports.SwagProp = void 0;
const Notores_1 = require("../Notores");
const lib_1 = require("../lib");
function getBuilder(target) {
    const app = Notores_1.NotoresApplication.app;
    let builder = app.swaggerRegistry.entities.find((builder) => builder.entity === target.constructor);
    if (!builder) {
        builder = new lib_1.SwagEntityBuilder(target.constructor);
        app.swaggerRegistry.entities.push(builder);
    }
    return builder;
}
function getType(input) {
    switch (input) {
        case String:
            return 'string';
        case Number:
            return 'number';
        case Boolean:
            return 'boolean';
        default:
            return input;
    }
}
function SwagProp(input) {
    return function SwagPropDoc(target, key) {
        const builder = getBuilder(target);
        const type = getType(Reflect.getMetadata('design:type', target, key));
        /**
         * Default to string, because at runtime, `type` definitions are not converted to strings but to Objects.
         */
        const newProp = {
            type: (0, lib_1.isPrimitiveNonArrayType)(type) ? type : 'string',
        };
        if (input && input.required)
            builder.addRequired(key);
        if ((0, lib_1.isClassType)(input) || (0, lib_1.isClassType)(newProp.type)) {
            if ((0, lib_1.isClassType)(newProp.type))
                builder.addRef(key, newProp.type);
            else if ((0, lib_1.isClassType)(input))
                builder.addRef(key, input);
        }
        else {
            if (input) {
                const _a = input, { required } = _a, restInput = __rest(_a, ["required"]);
                const propEnum = input.enum;
                delete input.enum;
                if (Object.keys(input).includes('anyOf') || Object.keys(input).includes('allOf'))
                    newProp.type = undefined;
                Object.assign(newProp, restInput);
                if (propEnum)
                    newProp.enum = Array.isArray(propEnum) ? propEnum : Object.values(propEnum).flat();
            }
            builder.addProperty(key, newProp);
        }
    };
}
exports.SwagProp = SwagProp;
function SwagArrayProp(input) {
    return function SwagArrayPropDoc(target, key) {
        const builder = getBuilder(target);
        if (input && input.required)
            builder.addRequired(key);
        if ((0, lib_1.isClassType)(input)) {
            builder.addArrayRef(key, input);
            return;
        }
        if ((0, lib_1.isSwagPropRefOptions)(input)) {
            builder.addArrayRef(key, input.type);
            return;
        }
        const { required } = input, arrayOptions = __rest(input, ["required"]);
        builder.addArrayProperty(key, arrayOptions);
    };
}
exports.SwagArrayProp = SwagArrayProp;
