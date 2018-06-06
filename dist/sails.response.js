var SailsResponse = (function () {
    function SailsResponse(JWR) {
        this.JWR = JWR;
    }
    SailsResponse.prototype.isOk = function () {
        return this.getStatusCode() >= 200 && this.getStatusCode() < 300;
    };
    SailsResponse.prototype.isCreated = function () {
        return this.getStatusCode() === 201;
    };
    SailsResponse.prototype.isUnauthorized = function () {
        return this.getStatusCode() === 401;
    };
    SailsResponse.prototype.isForbidden = function () {
        return this.getStatusCode() === 403;
    };
    SailsResponse.prototype.isNotFound = function () {
        return this.getStatusCode() === 404;
    };
    SailsResponse.prototype.isBadRequest = function () {
        return this.getStatusCode() === 400;
    };
    SailsResponse.prototype.isError = function () {
        return this.isClientError() || this.isServerError();
    };
    SailsResponse.prototype.isClientError = function () {
        return this.getStatusCode() >= 400 && !this.isServerError();
    };
    SailsResponse.prototype.isServerError = function () {
        return this.getStatusCode() >= 500;
    };
    SailsResponse.prototype.getCode = function () {
        return this.getBody().code;
    };
    SailsResponse.prototype.getData = function () {
        return this.getBody().data || this.getBody();
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
//# sourceMappingURL=sails.response.js.map