export function isClassType(input) {
    if (input?.name && ['Object', 'Function', 'Array'].includes(input.name))
        return false;
    try {
        new input();
        return true;
    }
    catch (e) {
        return false;
    }
}
export function isDefaultClassExport(input) {
    if (!input.default)
        return false;
}
