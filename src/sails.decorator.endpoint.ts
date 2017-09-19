export function Endpoint(value: string) {
    return function (target: any) {
        target.prototype.getEndPoint = function () {
            return value;
        }
    }
}
