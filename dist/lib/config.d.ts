import { Notores } from '../types/Notores';
export declare function getDefaultConfig(): Notores.Config;
/**
 * Loads the JSON file through readFileSync on the given path. It loads the file with encoding 'utf-8'
 * @param {String} filepath The filepath to load the JSON file fromt
 * @param {String} key A specific key to load from the JSON file
 * @return {Object|{error: string}}`
 * @example const result = getJsonFile(`${process.cwd()}/package.j son`, authors);
 */
export declare function getJsonFile<T extends Notores.Config>(filepath: string, key?: keyof T): Notores.Config | Error;
export declare function getConfig<T extends Notores.Config>(): T;
export declare function writeConfig<T extends Notores.Config>(update: Record<string, any>, key?: string): T | Error;
