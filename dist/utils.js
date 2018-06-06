export function isUndefined(value) {
    return typeof value === "undefined";
}
export function isString(value) {
    return typeof value === "string";
}
export function isEmptyObject(value) {
    return !Object.keys(value).length;
}
export function isObject(value) {
    return value instanceof Object;
}
//# sourceMappingURL=utils.js.map