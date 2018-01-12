/**
 * Model's Query path Decorator
 * @param path Query Path for Model
 */
export function Endpoint(path: string = "") {
    return (target: Function) => {
        target.prototype.getEndPoint = () => {
            return path;
        };
    };
}
