import {IModuleListing} from "../ModuleHandler";
import {IErrorObject} from "../Types";

export function isIErrorObject(obj: any): obj is IErrorObject {
    return obj.hasOwnProperty('error');
}


export function isIModuleListing(object: any): object is IModuleListing {
    return object.hasOwnProperty('name');
}