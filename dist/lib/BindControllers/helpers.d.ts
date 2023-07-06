import { ModuleMetaData } from "../ModuleMetaData";
/**
 * Generate response body from @Module key and response values
 * @param result - Response from the Module's routing function
 * @param moduleMetaData - Metadata derived from @Module settings
 */
export declare function setBody(result: any, moduleMetaData: ModuleMetaData): Record<string, any>;
/**
 * Recursively (taking into account super classes) find names of the methods, that were decorated with given property, in a class.
 * @param clazz - target class
 * @param symbolKey - Symbol('string') which is used to define routes
 * @param foundMethodsNames - array of methods names found (useful when concatenating results of recursive search through superclasses)
 */
export declare function getClassMethodsByDecoratedProperty(clazz: any, symbolKey: Symbol, foundMethodsNames?: string[]): string[];
