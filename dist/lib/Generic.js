"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionParamName = exports.getFunctionParams = exports.getAllPathParams = exports.getFirstPathParameter = exports.pathParamRegex = exports.capitalizeFirstLetter = void 0;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.pathParamRegex = /(?:\:)([a-z_\d]*)/gi;
function getFirstPathParameter(path) {
    return exports.pathParamRegex.exec(path);
}
exports.getFirstPathParameter = getFirstPathParameter;
function getAllPathParams(path) {
    return path.match(exports.pathParamRegex) || [];
}
exports.getAllPathParams = getAllPathParams;
/**
 * Implementation thanks to
 * https://www.geeksforgeeks.org/how-to-get-the-javascript-function-parameter-names-values-dynamically/
 * @param func
 */
function getFunctionParams(func) {
    let str = func.toString();
    str = str.replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/(.)*/g, '')
        .replace(/{[\s\S]*}/, '')
        .replace(/=>/g, '')
        .trim();
    const start = str.indexOf('(') + 1;
    const end = str.length - 1;
    const result = str.substring(start, end).split(", ");
    const params = [];
    result.forEach((element) => {
        element = element.replace(/=[\s\S]*/g, '').trim();
        if (element.length > 0)
            params.push(element);
    });
    return params;
}
exports.getFunctionParams = getFunctionParams;
function getFunctionParamName(func, index) {
    const params = getFunctionParams(func);
    return params[index];
}
exports.getFunctionParamName = getFunctionParamName;
