/**
 * Model's Query path Decorator
 * @param path Query Path for Model
 */
/**
 * Model's Query path Decorator
 * @param path Query Path for Model
 */ export function Endpoint(path) {
    if (path === void 0) { path = ""; }
    return function (target) {
        target.prototype.getEndPoint = function () {
            return path;
        };
    };
}
//# sourceMappingURL=sails.decorator.endpoint.js.map