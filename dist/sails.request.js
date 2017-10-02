var SailsRequestOptions = /** @class */ (function () {
    function SailsRequestOptions(options) {
        if (options === void 0) { options = {
            url: "",
            method: "",
            params: {},
            headers: {}
        }; }
        this.options = options;
    }
    SailsRequestOptions.prototype.clone = function (options) {
        Object.assign(this, { options: options });
        return this;
    };
    Object.defineProperty(SailsRequestOptions.prototype, "method", {
        get: function () {
            return this.options.method;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SailsRequestOptions.prototype, "url", {
        get: function () {
            return this.options.url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SailsRequestOptions.prototype, "params", {
        get: function () {
            return this.options.params;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SailsRequestOptions.prototype, "headers", {
        get: function () {
            return this.options.headers;
        },
        enumerable: true,
        configurable: true
    });
    SailsRequestOptions.prototype.getOptions = function () {
        return this.options;
    };
    return SailsRequestOptions;
}());
export { SailsRequestOptions };
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
    SailsRequest.prototype.post = function (url, params) {
        return this._request(Method.POST, url, params);
    };
    SailsRequest.prototype.put = function (url, params) {
        return this._request(Method.PUT, url, params);
    };
    SailsRequest.prototype.delete = function (url) {
        return this._request(Method.DELETE, url);
    };
    SailsRequest.prototype.patch = function (url) {
        return this._request(Method.PATCH, url);
    };
    SailsRequest.prototype._request = function (method, url, params) {
        var request = new SailsRequestOptions({ method: method, url: this.buildQuery(url), params: params, headers: this.getHeaders() });
        return this.sails.request(request);
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
