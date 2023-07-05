export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const pathParamRegex = /(?:\:)([a-z_\d]*)/gi;

export function getFirstPathParameter(path:string) {
    return pathParamRegex.exec(path);
}

export function getAllPathParams(path: string): string[] {
    return path.match(pathParamRegex) || [];
}

/**
 * Implementation thanks to
 * https://www.geeksforgeeks.org/how-to-get-the-javascript-function-parameter-names-values-dynamically/
 * @param func
 */
export function getFunctionParams(func: Function) {
    let str = func.toString();

    str = str.replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/(.)*/g, '')
        .replace(/{[\s\S]*}/, '')
        .replace(/=>/g, '')
        .trim();

    const start = str.indexOf('(') + 1;
    const end = str.length - 1;
    const result = str.substring(start, end).split(", ");
    const params = [];
    result.forEach((element: string) => {
        element = element.replace(/=[\s\S]*/g, '').trim();
        if(element.length > 0) params.push(element);
    });

    return params;
}

export function getFunctionParamName(func: Function, index: number) {
    const params = getFunctionParams(func);
    return params[index];
}