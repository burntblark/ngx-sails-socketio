import { QueryBuilder } from "./sails.query";
import { isUndefined, isString, isEmptyObject, isObject } from "./utils";
var QueryCriteria = /** @class */ (function () {
    function QueryCriteria() {
        this.criteria = {};
        this.orCriteria = {};
    }
    QueryCriteria.prototype.build = function () {
        var queryBuilder = (new QueryBuilder())
            .append(this.whereFunction());
        return queryBuilder.toString();
    };
    QueryCriteria.prototype.whereFunction = function () {
        if (isEmptyObject(this.criteria)) {
            return null;
        }
        var stringify = function (criteria) { return "where=" + JSON.stringify(criteria); };
        if (!isEmptyObject(this.orCriteria)) {
            if (Array.isArray(this.orCriteria["or"])) {
                this.orCriteria["or"].push(this.criteria);
            }
            return stringify(this.orCriteria);
        }
        return stringify(this.criteria);
    };
    QueryCriteria.prototype.whereNotEqualTo = function (key, value) {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "!": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["!"])) {
            this.criteria[key]["!"] = value;
            return this;
        }
        throw new Error("DuplicateError: ! clause, use whereNotIn instead");
    };
    QueryCriteria.prototype.whereLike = function (key, value) {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "like": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["like"])) {
            this.criteria[key]["like"] = value;
            return this;
        }
        throw new Error("DuplicateError: like clause has already been used in this query");
    };
    QueryCriteria.prototype.whereEqualTo = function (key, value) {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = value;
            return this;
        }
        throw new Error("DuplicateError: contains clause has already been used in this query");
    };
    QueryCriteria.prototype.whereContains = function (key, value) {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "contains": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["contains"])) {
            this.criteria[key]["contains"] = value;
            return this;
        }
        throw new Error("DuplicateError: contains clause has already been used in this query");
    };
    QueryCriteria.prototype.whereStartsWith = function (key, value) {
        if (isString(this.criteria[key])) {
            this.criteria[key] = { "startsWith": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["startsWith"])) {
            this.criteria[key]["startsWith"] = value;
            return this;
        }
        throw new Error("DuplicateError: startsWith clause has already been used in this query");
    };
    QueryCriteria.prototype.whereEndsWith = function (key, value) {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "endsWith": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["endsWith"])) {
            this.criteria[key]["endsWith"] = value;
            return this;
        }
        throw new Error("DuplicateError: endsWith clause has already been used in this query");
    };
    QueryCriteria.prototype.whereNotIn = function (key, value) {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "!": [value] };
            return this;
        }
        if (isUndefined(this.criteria[key]["!"])) {
            this.criteria[key]["!"] = [value];
            return this;
        }
        if (Array.isArray(this.criteria[key]["!"])) {
            this.criteria[key]["!"].push(value);
        }
        else {
            this.criteria[key]["!"] = [this.criteria[key]["!"], value];
        }
        return this;
    };
    QueryCriteria.prototype.whereLessThan = function (key, value) {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "<": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["<"])) {
            this.criteria[key]["<"] = value;
            return this;
        }
        throw new Error("DuplicateError: < clause has already been used in this query");
    };
    QueryCriteria.prototype.whereLessThanOrEqualTo = function (key, value) {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "<=": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["<="])) {
            this.criteria[key]["<="] = value;
            return this;
        }
        throw new Error("DuplicateError: <= clause has already been used in this query");
    };
    QueryCriteria.prototype.whereGreaterThan = function (key, value) {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { ">": value };
            return this;
        }
        if (isUndefined(this.criteria[key][">"])) {
            this.criteria[key][">"] = value;
            return this;
        }
        throw new Error("DuplicateError: > clause has already been used in this query");
    };
    QueryCriteria.prototype.whereGreaterThanOrEqualTo = function (key, value) {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { ">=": value };
            return this;
        }
        if (isUndefined(this.criteria[key][">="])) {
            this.criteria[key][">="] = value;
            return this;
        }
        throw new Error("DuplicateError: >= clause has already been used in this query");
    };
    QueryCriteria.prototype.or = function () {
        if (isUndefined(this.orCriteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
            this.criteria = {};
            return this;
        }
        if (Array.isArray(this.orCriteria["or"])) {
            this.orCriteria["or"].push(this.criteria);
        }
        else if (isObject(this.criteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
        }
        this.criteria = {};
        return this;
    };
    return QueryCriteria;
}());
export { QueryCriteria };
