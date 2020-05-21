import '../namespace/Notores';
export declare function addConfigDefault(obj: Notores.IConfigObject): void;
export declare function getConfigDefaults(): Notores.IConfigObject[];
export declare function getDefaultConfig(): Notores.IConfigObject;
/**
 * Loads the JSON file through readFileSync on the given path. It loads the file with encoding 'utf-8'
 * @param {String} filepath The filepath to load the JSON file fromt
 * @param {String} key A specific key to load from the JSON file
 * @return {Object|{error: string}}`
 * @example const result = getJsonFile(`${process.cwd()}/package.j son`, authors);
 */
export declare function getJsonFile(filepath: string, key?: string): Notores.IConfigObject | Error;
export declare function getConfig(key?: string): Notores.IConfig;
export declare function getPackage(key: string): Object;
export declare function writeConfig(obj: Object, key: string): Notores.IConfig | Error;
//# sourceMappingURL=config.d.ts.map