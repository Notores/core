import {ClassType, DefaultClassExport} from "../types/Notores";

export function isClassType(input: any): input is ClassType {
    if (input?.name && ['Object', 'Function', 'Array'].includes(input.name))
        return false;
    try {
        new input();
        return true;
    } catch (e) {
        return false;
    }
}

export function isDefaultClassExport(input: any): input is DefaultClassExport {
    if (!input.default) return false;
}