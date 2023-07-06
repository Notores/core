"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logErrorApiMetaDataDoesNotExist = exports.logWarningIfNoAuthentication = void 0;
const config_1 = require("../config");
const ApiMetaData_1 = require("../ApiMetaData");
const Logger_1 = require("../Logger");
const SystemLogger = (0, Logger_1.systemLoggerFactory)('@notores/core - BindControllers');
/**
 * Send a warning to console and logs if authentication is not enabled
 * @param decorator - the name of the decorator
 * @param controller - controller that contains the function that was decorated
 * @param func - the function name that was decorated by an authentication related decorator
 */
function logWarningIfNoAuthentication(decorator, controller, func) {
    var _a;
    if (!(0, config_1.getConfig)().authentication.enabled) {
        SystemLogger.warn(`WARNING: Route Insecure. Use of @${decorator} in ${((_a = controller === null || controller === void 0 ? void 0 : controller.constructor) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown'}.${func} while authentication is disabled in notores.json`);
    }
}
exports.logWarningIfNoAuthentication = logWarningIfNoAuthentication;
/**
 * Send a warning to console and logs if authentication is not enabled
 * @param decorator - the name of the decorator
 * @param controller - controller that contains the function that was decorated
 * @param func - the function name that was decorated by an authentication related decorator
 */
function logErrorApiMetaDataDoesNotExist(decorator, controller, func) {
    var _a;
    if (!(0, config_1.getConfig)().authentication.enabled) {
        SystemLogger.error(`ERROR: Route does not have an HTTP handle. Use of @${decorator} in ${((_a = controller === null || controller === void 0 ? void 0 : controller.constructor) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown'}.${func}. Try using one of ${Object.keys(ApiMetaData_1.HttpMethod).map((method) => `@${method}`)}`);
    }
}
exports.logErrorApiMetaDataDoesNotExist = logErrorApiMetaDataDoesNotExist;
