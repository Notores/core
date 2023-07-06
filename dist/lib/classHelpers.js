"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefaultClassExport = exports.isClassType = void 0;
function isClassType(input) {
    if ((input === null || input === void 0 ? void 0 : input.name) && ['Object', 'Function', 'Array'].includes(input.name))
        return false;
    try {
        new input();
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isClassType = isClassType;
function isDefaultClassExport(input) {
    if (!input.default)
        return false;
}
exports.isDefaultClassExport = isDefaultClassExport;
