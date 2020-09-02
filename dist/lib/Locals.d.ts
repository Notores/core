import '../namespace/Notores';
import { Request } from "express";
interface KeyValueObject {
    [key: string]: any;
}
export declare class Locals implements KeyValueObject {
    static toJsonKeys: string[];
    static allowedResponseTypes: Array<string>;
    static properties: Array<{
        key: string;
        defaultValue: any;
    }>;
    static addProperty(key: string, defaultValue: any): void;
    static extend(obj: object): void;
    static defineProperty(key: string, obj: any): void;
    static addResponseType(type: string): void;
    static addToJsonKeys(keys: Array<string> | string): void;
    private _contentType;
    private _body;
    private readonly _payload;
    private readonly _url;
    private readonly _path;
    private readonly _config;
    private _type;
    private _user;
    private _query;
    private _error;
    private _authenticated;
    private _NODE_ENV;
    private _extended;
    private _ejs_paths;
    private _ejs_pages;
    constructor(req: Request);
    env(envCheck?: string): boolean;
    setBody(body: object, overwrite?: boolean): ({} & object) | undefined;
    bodyIsSet(body?: object | null): boolean;
    addPageLocations(locations: string[]): void;
    addPages(pages: string[]): void;
    extend: (path: string, data: any) => void;
    get extended(): boolean | {
        path: string;
        data: any;
    };
    get isExtended(): boolean;
    get pageLocations(): string[];
    get pages(): string[];
    get body(): {};
    get type(): string;
    get config(): {};
    set type(value: string);
    get user(): {};
    set user(value: {});
    get query(): {};
    set query(value: {});
    get authenticated(): Boolean;
    set authenticated(value: Boolean);
    set error(obj: {
        status: number;
        message: string;
    });
    get error(): {
        status: number;
        message: string;
    };
    get hasError(): boolean;
    get NODE_ENV(): string;
    get payload(): {};
    get url(): string;
    get path(): string;
    toJSON(forType?: string): KeyValueObject;
}
export {};
//# sourceMappingURL=Locals.d.ts.map