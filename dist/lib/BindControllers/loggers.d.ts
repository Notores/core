/**
 * Send a warning to console and logs if authentication is not enabled
 * @param decorator - the name of the decorator
 * @param controller - controller that contains the function that was decorated
 * @param func - the function name that was decorated by an authentication related decorator
 */
export declare function logWarningIfNoAuthentication(decorator: string, controller: string, func: string): void;
/**
 * Send a warning to console and logs if authentication is not enabled
 * @param decorator - the name of the decorator
 * @param controller - controller that contains the function that was decorated
 * @param func - the function name that was decorated by an authentication related decorator
 */
export declare function logErrorApiMetaDataDoesNotExist(decorator: string, controller: string, func: string): void;
