/**
 * Model's Query path Decorator
 * @param path Query Path for Model
 */
export function Endpoint(value: string) {
    return function (target: Function) {
        target.prototype.getEndPoint = function () {
            return value;
        }
    }
}
