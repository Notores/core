import {IModuleListing} from "../ModuleHandler";

export function isIErrorObject(obj: any) {
    return obj.hasOwnProperty('error');
}


export function isIModuleListing(object: any): object is IModuleListing {
    return object.hasOwnProperty('name');
}