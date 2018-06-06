var SailsRequestOptions = (function () {
    function SailsRequestOptions(_a) {
        var url = _a.url, method = _a.method, params = _a.params, headers = _a.headers;
        this.options = { url: url, method: method, params: this.toMap(params), headers: this.toMap(headers) };
    }
    SailsRequestOptions.prototype.clone = function (options) {
        // Strip out undefined values
        for (var name_1 in options) {
            if (!this.options.hasOwnProperty(name_1) || !options[name_1]) {
                delete options[name_1];
            }
        }
        Object.assign(this.options, options);
        return this;
    };
    SailsRequestOptions.prototype.toMap = function (obj) {
        if (obj === void 0) { obj = {}; }
        var map = new Map;
        Object.keys(obj).forEach(function (k) { return (map.set(k, obj[k])); });
        return map;
    };
    SailsRequestOptions.prototype.toObject = function (map) {
        if (map === void 0) { map = new Map; }
        var obj = {};
        map.forEach(function (v, k) { return (obj[k] = v); });
        return obj;
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
    SailsRequestOptions.prototype.serialize = function () {
        return {
            url: this.url,
            method: this.method,
            params: this.toObject(this.params),
            headers: this.toObject(this.headers)
        };
    };
    return SailsRequestOptions;
}());
export { SailsRequestOptions };
//# sourceMappingURL=sails.request.options.js.map