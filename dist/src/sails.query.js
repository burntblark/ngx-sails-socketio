import * as _ from "lodash";
export var METHOD;
(function (METHOD) {
    METHOD[METHOD["POST"] = 0] = "POST";
    METHOD[METHOD["GET"] = 1] = "GET";
    METHOD[METHOD["DELETE"] = 2] = "DELETE";
    METHOD[METHOD["UPDATE"] = 3] = "UPDATE";
})(METHOD || (METHOD = {}));
var SailsQuery = /** @class */ (function () {
    function SailsQuery(sails, type) {
        this.sails = sails;
        this.criteria = {};
        this.orCriteria = {};
        this.where = "";
        this.limit = 30;
        this.sort = "";
        this.skip = 0;
        this.population = [];
        this._model = new type(this.sails);
    }
    Object.defineProperty(SailsQuery.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    SailsQuery.prototype.find = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = "/";
            url += _.toLower(_this.model.getEndPoint());
            var query = _this.buildQuery();
            if (query) {
                url += query;
            }
            var that = _this;
            _this.sails.get(url, function (res) {
                if (res.getCode() === "OK") {
                    var results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    };
    SailsQuery.prototype.findById = function (id, populate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = "/";
            url += _.toLower(_this.model.getEndPoint());
            url += "/".concat(id);
            if (populate) {
                if (url.includes("?")) {
                    url += "&populate=[" + _.join(populate, ",") + "]";
                }
                else {
                    url += "?populate=[" + _.join(populate, ",") + "]";
                }
            }
            var that = _this;
            _this.sails.get(url, function (res) {
                if (res.getCode() === "OK") {
                    var results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    };
    SailsQuery.prototype.findAll = function (populate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = "/";
            url += _.toLower(_this.model.getEndPoint());
            if (populate) {
                if (url.includes("?")) {
                    url += "&populate=[" + _.join(populate, ",") + "]&limit=1000";
                }
                else {
                    url += "?populate=[" + _.join(populate, ",") + "]&limit=1000";
                }
            }
            if (url.includes("?")) {
                url += "&limit=1000";
            }
            else {
                url += "?limit=1000";
            }
            var that = _this;
            _this.sails.get(url, function (res) {
                if (res.getCode() === "OK") {
                    var results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    };
    SailsQuery.prototype.save = function (model) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = "/";
            url += _.toLower(model.getEndPoint());
            var that = _this;
            _this.sails.post(url, model, function (res) {
                if (res.getCode() === "CREATED") {
                    var results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    };
    SailsQuery.prototype.update = function (model) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = "/";
            url += _.toLower(model.getEndPoint());
            url += "/".concat("" + model.id); // Make sure .id is a string
            // delete model.socketIOConfig; // Why???
            delete model.createdAt;
            delete model.updatedAt;
            var that = _this;
            _this.sails.put(url, model, function (res) {
                if (res.getCode() === "OK") {
                    var results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    };
    SailsQuery.prototype.remove = function (model) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = "/";
            url += _.toLower(model.getEndPoint());
            url += "/".concat("" + model.id); // Make sure .id is a string
            var that = _this;
            _this.sails.delete(url, function (res) {
                if (res.getCode() === "OK") {
                    var results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    };
    SailsQuery.prototype.action = function (path, method, data) {
        var _this = this;
        var url = "/";
        url += _.toLower(this.model.getEndPoint());
        url += "/".concat(path);
        var that = this;
        return new Promise(function (resolve, reject) {
            if (method === METHOD.POST) {
                _this.sails.post(url, data || {}, function (res) {
                    if (res.getCode() === "OK") {
                        var results = that.castResponseToModel(res.getData());
                        resolve(results);
                    }
                    reject(res);
                });
            }
            else {
                if (data instanceof SailsQuery) {
                    url += data.buildQuery();
                }
                _this.sails.get(url, function (res) {
                    if (res.getCode() === "OK") {
                        var results = that.castResponseToModel(res.getData());
                        resolve(results);
                    }
                    reject(res);
                });
            }
        });
    };
    SailsQuery.prototype.on = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var eventName = _.toLower(_this.model.getEndPoint());
            var that = _this;
            _this.sails.on(eventName, function (res) {
                if (res.getCode() === "OK") {
                    var results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    };
    SailsQuery.prototype.castResponseToModel = function (response) {
        var singleR = this;
        var results = null;
        if (_.isArray(response)) {
            results = _.map(response, function (_item, index) {
                var item = _.clone(singleR);
                delete item.socketIOConfig;
                Object.assign(item, _item);
                return item;
            });
        }
        else if (_.isObject(response)) {
            var item = _.clone(singleR);
            delete item.socketIOConfig;
            Object.assign(item, response);
            results = item;
        }
        return results;
    };
    SailsQuery.prototype.whereFunction = function () {
        if (_.isEmpty(this.criteria)) {
            return null;
        }
        if (!_.isEmpty(this.orCriteria)) {
            if (_.isArray(this.orCriteria["or"])) {
                this.orCriteria["or"].push(this.criteria);
            }
            return "where=" + JSON.stringify(this.orCriteria);
        }
        return "where=" + JSON.stringify(this.criteria);
    };
    SailsQuery.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    SailsQuery.prototype.limitFunction = function () {
        if (this.limit == null) {
            return null;
        }
        return "limit=" + this.limit.toString();
    };
    SailsQuery.prototype.setSort = function (sort) {
        this.sort = sort;
        return this;
    };
    SailsQuery.prototype.sortFunction = function () {
        if (this.sort == null || _.isEmpty(this.sort)) {
            return null;
        }
        return "sort=" + this.sort;
    };
    SailsQuery.prototype.setSkip = function (skip) {
        this.skip = skip;
        return this;
    };
    SailsQuery.prototype.skipFunction = function () {
        if (this.skip == null) {
            return null;
        }
        return "skip=" + this.skip.toString();
    };
    SailsQuery.prototype.buildQuery = function () {
        var queryBuilder = "";
        var wherePart = this.whereFunction();
        if (wherePart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += wherePart;
        }
        var limitPart = this.limitFunction();
        if (limitPart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += limitPart;
        }
        var skipPart = this.skipFunction();
        if (skipPart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += skipPart;
        }
        var populatePart = this.populateFunction();
        if (populatePart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += populatePart;
        }
        if (queryBuilder.charAt(0) !== "?") {
            queryBuilder = "?" + queryBuilder;
        }
        return queryBuilder.toString();
    };
    SailsQuery.prototype.or = function () {
        if (_.isUndefined(this.orCriteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
            this.criteria = {};
            return this;
        }
        if (_.isArray(this.orCriteria["or"])) {
            this.orCriteria["or"].push(this.criteria);
        }
        else if (_.isObject(this.criteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
        }
        this.criteria = {};
        return this;
    };
    SailsQuery.prototype.populate = function (value) {
        if (_.isArray(this.population)) {
            this.population.push(value);
        }
        return this;
    };
    SailsQuery.prototype.populateFunction = function () {
        if (this.population == null || _.isEmpty(this.population)) {
            return null;
        }
        return "populate=[" + _.join(this.population, ",") + "]";
    };
    SailsQuery.prototype.whereNotEqualTo = function (key, value) {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "!": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["!"])) {
            this.criteria[key]["!"] = value;
            return this;
        }
        throw new Error("DuplicateError: ! clause, use whereNotIn instead");
    };
    SailsQuery.prototype.whereLike = function (key, value) {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "like": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["like"])) {
            this.criteria[key]["like"] = value;
            return this;
        }
        throw new Error("DuplicateError: like clause has already been used in this query");
    };
    SailsQuery.prototype.whereContains = function (key, value) {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "contains": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["contains"])) {
            this.criteria[key]["contains"] = value;
            return this;
        }
        throw new Error("DuplicateError: contains clause has already been used in this query");
    };
    SailsQuery.prototype.whereStartsWith = function (key, value) {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "startsWith": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["startsWith"])) {
            this.criteria[key]["startsWith"] = value;
            return this;
        }
        throw new Error("DuplicateError: startsWith clause has already been used in this query");
    };
    SailsQuery.prototype.whereEndsWith = function (key, value) {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "endsWith": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["endsWith"])) {
            this.criteria[key]["endsWith"] = value;
            return this;
        }
        throw new Error("DuplicateError: endsWith clause has already been used in this query");
    };
    SailsQuery.prototype.whereNotIn = function (key, value) {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "!": [value] };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["!"])) {
            this.criteria[key]["!"] = [value];
            return this;
        }
        if (_.isArray(this.criteria[key]["!"])) {
            this.criteria[key]["!"].push(value);
        }
        else {
            this.criteria[key]["!"] = [this.criteria[key]["!"], value];
        }
        return this;
    };
    SailsQuery.prototype.whereLessThan = function (key, value) {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "<": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["<"])) {
            this.criteria[key]["<"] = value;
            return this;
        }
        throw new Error("DuplicateError: < clause has already been used in this query");
    };
    SailsQuery.prototype.whereLessThanOrEqualTo = function (key, value) {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "<=": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["<="])) {
            this.criteria[key]["<="] = value;
            return this;
        }
        throw new Error("DuplicateError: <= clause has already been used in this query");
    };
    SailsQuery.prototype.whereGreaterThan = function (key, value) {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { ">": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key][">"])) {
            this.criteria[key][">"] = value;
            return this;
        }
        throw new Error("DuplicateError: > clause has already been used in this query");
    };
    SailsQuery.prototype.whereGreaterThanOrEqualTo = function (key, value) {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { ">=": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key][">="])) {
            this.criteria[key][">="] = value;
            return this;
        }
        throw new Error("DuplicateError: >= clause has already been used in this query");
    };
    return SailsQuery;
}());
export { SailsQuery };
//# sourceMappingURL=/Users/apple/Desktop/ANGULAR/ngx-sails-socketio/src/sails.query.js.map