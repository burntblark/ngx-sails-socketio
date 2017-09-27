var SailsResponse = /** @class */ (function () {
    function SailsResponse(JWR) {
        this.JWR = JWR;
    }
    SailsResponse.prototype.getCode = function () {
        return this.getBody().code;
    };
    SailsResponse.prototype.getData = function () {
        return this.getBody().data;
    };
    SailsResponse.prototype.getMessage = function () {
        return this.getBody().message;
    };
    SailsResponse.prototype.getBody = function () {
        return this.JWR.body;
    };
    SailsResponse.prototype.getHeaders = function () {
        return this.JWR.headers;
    };
    SailsResponse.prototype.getError = function () {
        return this.JWR.error;
    };
    SailsResponse.prototype.getStatusCode = function () {
        return this.JWR.statusCode;
    };
    SailsResponse.prototype.pipe = function () {
        return this.JWR.pipe();
    };
    SailsResponse.prototype.toPOJO = function () {
        return this.JWR.toPOJO();
    };
    SailsResponse.prototype.toString = function () {
        return this.JWR.toString();
    };
    return SailsResponse;
}());
export { SailsResponse };
