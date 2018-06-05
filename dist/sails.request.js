import { SailsRequestOptions } from "./sails.request.options";
var QueryBuilder = (function () {
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
var SailsRequest = (function () {
    function SailsRequest(sails) {
        this.sails = sails;
        this.parameters = [];
    }
    SailsRequest.prototype.get = function (url, headers) {
        return this._request(Method.GET, url, headers);
    };
    SailsRequest.prototype.post = function (url, params, headers) {
        return this._request(Method.POST, url, params, headers);
    };
    SailsRequest.prototype.put = function (url, params, headers) {
        return this._request(Method.PUT, url, params, headers);
    };
    SailsRequest.prototype.delete = function (url, headers) {
        return this._request(Method.DELETE, url, headers);
    };
    SailsRequest.prototype.patch = function (url, headers) {
        return this._request(Method.PATCH, url, headers);
    };
    SailsRequest.prototype._request = function (method, url, params, headers) {
        var request = new SailsRequestOptions({ method: method, url: this.buildQuery(url), params: params, headers: headers });
        return this.sails.request(request);
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
