"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isIErrorObject(obj) {
    return obj.hasOwnProperty('error');
}
exports.isIErrorObject = isIErrorObject;
function isIModuleListing(object) {
    return object.hasOwnProperty('name');
}
exports.isIModuleListing = isIModuleListing;
