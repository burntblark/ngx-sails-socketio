"use strict";
exports.__esModule = true;
function Endpoint(value) {
    return function (target) {
        target.prototype.getEndPoint = function () {
            return value;
        };
    };
}
exports.Endpoint = Endpoint;
