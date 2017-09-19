import * as _ from "lodash";
var Criteria = /** @class */ (function () {
    function Criteria() {
        this.criteria = {};
        this.orCriteria = {};
        this.where = "";
        this.limit = 30;
        this.sort = "";
        this.skip = 0;
        this.population = [];
    }
    Criteria.prototype.whereFunction = function () {
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
    Criteria.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    Criteria.prototype.limitFunction = function () {
        if (this.limit == null) {
            return null;
        }
        return "limit=" + this.limit.toString();
    };
    Criteria.prototype.setSort = function (sort) {
        this.sort = sort;
        return this;
    };
    Criteria.prototype.sortFunction = function () {
        if (this.sort == null || _.isEmpty(this.sort)) {
            return null;
        }
        return "sort=" + this.sort;
    };
    Criteria.prototype.setSkip = function (skip) {
        this.skip = skip;
        return this;
    };
    Criteria.prototype.skipFunction = function () {
        if (this.skip == null) {
            return null;
        }
        return "skip=" + this.skip.toString();
    };
    Criteria.prototype.buildQuery = function () {
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
    Criteria.prototype.or = function () {
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
    Criteria.prototype.populate = function (value) {
        if (_.isArray(this.population)) {
            this.population.push(value);
        }
        return this;
    };
    Criteria.prototype.populateFunction = function () {
        if (this.population == null || _.isEmpty(this.population)) {
            return null;
        }
        return "populate=[" + _.join(this.population, ",") + "]";
    };
    Criteria.prototype.whereNotEqualTo = function (key, value) {
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
    Criteria.prototype.whereLike = function (key, value) {
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
    Criteria.prototype.whereContains = function (key, value) {
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
    Criteria.prototype.whereStartsWith = function (key, value) {
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
    Criteria.prototype.whereEndsWith = function (key, value) {
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
    Criteria.prototype.whereNotIn = function (key, value) {
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
    Criteria.prototype.whereLessThan = function (key, value) {
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
    Criteria.prototype.whereLessThanOrEqualTo = function (key, value) {
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
    Criteria.prototype.whereGreaterThan = function (key, value) {
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
    Criteria.prototype.whereGreaterThanOrEqualTo = function (key, value) {
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
    return Criteria;
}());
export { Criteria };
//# sourceMappingURL=/Users/apple/Desktop/ANGULAR/ngx-sails-socketio/src/sails.query.criteria.js.map