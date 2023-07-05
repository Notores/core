import {getConfig} from "../config";
import {HttpMethod} from "../ApiMetaData";
import {systemLoggerFactory} from "../Logger";

const SystemLogger = systemLoggerFactory('@notores/core - BindControllers')

/**
 * Send a warning to console and logs if authentication is not enabled
 * @param decorator - the name of the decorator
 * @param controller - controller that contains the function that was decorated
 * @param func - the function name that was decorated by an authentication related decorator
 */
export function logWarningIfNoAuthentication(decorator: string, controller: string, func: string) {
    if (!getConfig().authentication.enabled) {
        SystemLogger.warn(`WARNING: Route Insecure. Use of @${decorator} in ${controller?.constructor?.name || 'Unknown'}.${func} while authentication is disabled in notores.json`);
    }
}

/**
 * Send a warning to console and logs if authentication is not enabled
 * @param decorator - the name of the decorator
 * @param controller - controller that contains the function that was decorated
 * @param func - the function name that was decorated by an authentication related decorator
 */
export function logErrorApiMetaDataDoesNotExist(decorator: string, controller: string, func: string) {
    if (!getConfig().authentication.enabled) {
        SystemLogger.error(`ERROR: Route does not have an HTTP handle. Use of @${decorator} in ${controller?.constructor?.name || 'Unknown'}.${func}. Try using one of ${Object.keys(HttpMethod).map((method: string) => `@${method}`)}`);
    }
}