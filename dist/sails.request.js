var QueryBuilder = /** @class */ (function () {
    function QueryBuilder(query) {
        if (query === void 0) { query = ""; }
        this.query = query;
    }
    QueryBuilder.prototype.append = function (criteria) {
        if (typeof criteria === "string") {
            if (this.query.length) {
                this.query += "&";
            }
            this.query += criteria;
        }
        return this;
    };
    QueryBuilder.prototype.toString = function () {
        if (this.query && this.query.charAt(0) !== "?") {
            this.query = "?" + this.query;
        }
        return this.query;
    };
    return QueryBuilder;
}());
export var Method = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
    PATCH: "patch",
};
var SailsRequest = /** @class */ (function () {
    function SailsRequest(sails) {
        this.sails = sails;
        this.headers = {};
        this.parameters = [];
    }
    SailsRequest.prototype.get = function (url) {
        return this._request(Method.GET, url);
    };
    SailsRequest.prototype.post = function (url, data) {
        return this._request(Method.POST, url, data);
    };
    SailsRequest.prototype.put = function (url, data) {
        return this._request(Method.PUT, url, data);
    };
    SailsRequest.prototype.delete = function (url) {
        return this._request(Method.DELETE, url);
    };
    SailsRequest.prototype.patch = function (url) {
        return this._request(Method.PATCH, url);
    };
    SailsRequest.prototype._request = function (method, url, data) {
        return this.sails.request(method, this.buildQuery(url), data, this.getHeaders());
    };
    SailsRequest.prototype.on = function (eventName) {
        return this.sails.on(eventName.toLowerCase());
    };
    SailsRequest.prototype.off = function (eventName) {
        return this.sails.off(eventName.toLowerCase());
    };
    SailsRequest.prototype.addHeader = function (name, value) {
        this.headers[name] = value;
        return this;
    };
    SailsRequest.prototype.getHeaders = function () {
        return this.headers;
    };
    SailsRequest.prototype.addParam = function (name, value) {
        if (value.toString().length) {
            this.parameters.push(name + "=" + value);
        }
        return this;
    };
    SailsRequest.prototype.getParams = function () {
        return this.parameters.join("&");
    };
    SailsRequest.prototype.buildQuery = function (url) {
        return url.toLowerCase() + new QueryBuilder(this.getParams());
    };
    return SailsRequest;
}());
export { SailsRequest };
