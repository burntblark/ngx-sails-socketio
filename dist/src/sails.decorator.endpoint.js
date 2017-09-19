export function Endpoint(value) {
    return function (target) {
        target.prototype.getEndPoint = function () {
            return value;
        };
    };
}
//# sourceMappingURL=/Users/apple/Desktop/ANGULAR/ngx-sails-socketio/src/sails.decorator.endpoint.js.map