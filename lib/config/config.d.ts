import { IDefaultConfigObject, IErrorObject, INotoresConfig } from "../../Types";
export declare function addConfigDefault(obj: IDefaultConfigObject): void;
export declare function getConfigDefaults(): IDefaultConfigObject[];
export declare function getDefaultConfig(): Object;
/**
 * Loads the JSON file through readFileSync on the given path. It loads the file with encoding 'utf-8'
 * @param {String} filepath The filepath to load the JSON file fromt
 * @param {String} key A specific key to load from the JSON file
 * @return {Object|{error: string}}
 * @example const result = getJsonFile(`${process.cwd()}/package.j son`, authors);
 */
export declare function getJsonFile(filepath: string, key?: string): INotoresConfig | IErrorObject;
export declare function getConfig(key?: string): INotoresConfig;
export declare function getPackage(key: string): Object;
export declare function writeConfig(obj: Object, key: string): INotoresConfig | IErrorObject;
//# sourceMappingURL=config.d.ts.map