import {ModuleMetaData} from "../ModuleMetaData";

/**
 * Generate response body from @Module key and response values
 * @param result - Response from the Module's routing function
 * @param moduleMetaData - Metadata derived from @Module settings
 */
export function setBody(result: any, moduleMetaData: ModuleMetaData): Record<string, any> {
    if (moduleMetaData.responseIsBody) {
        return result;
    } else if (result instanceof Error) {
        return {error: result.message};
    } else if (typeof result === 'object' && !Array.isArray(result) && result.hasOwnProperty(moduleMetaData.dataKey as string)) {
        return result;
    } else {
        return {[moduleMetaData.dataKey as string]: result};
    }
}

/**
 * Recursively (taking into account super classes) find names of the methods, that were decorated with given property, in a class.
 * @param clazz - target class
 * @param symbolKey - Symbol('string') which is used to define routes
 * @param foundMethodsNames - array of methods names found (useful when concatenating results of recursive search through superclasses)
 */
export function getClassMethodsByDecoratedProperty(clazz, symbolKey: Symbol, foundMethodsNames: string[] = []): string[] {
    const clazzMethods = foundMethodsNames.concat(
        Object.getOwnPropertyNames(clazz.prototype)
            .filter(functionName => functionName !== 'constructor')
            .filter(functionName => Reflect.getOwnMetadata(symbolKey, clazz.prototype[functionName]) !== undefined)
    );

    const parentClazz = Object.getPrototypeOf(clazz);
    if (parentClazz.name !== '') {
        return getClassMethodsByDecoratedProperty(parentClazz, symbolKey, clazzMethods);
    }
    // returns an array of *unique* method names
    return clazzMethods.filter((methodName: string, index: number, array: string[]) => array.indexOf(methodName) === index);
}