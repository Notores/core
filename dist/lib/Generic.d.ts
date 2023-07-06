export declare function capitalizeFirstLetter(string: any): any;
export declare const pathParamRegex: RegExp;
export declare function getFirstPathParameter(path: string): RegExpExecArray;
export declare function getAllPathParams(path: string): string[];
/**
 * Implementation thanks to
 * https://www.geeksforgeeks.org/how-to-get-the-javascript-function-parameter-names-values-dynamically/
 * @param func
 */
export declare function getFunctionParams(func: Function): any[];
export declare function getFunctionParamName(func: Function, index: number): any;
