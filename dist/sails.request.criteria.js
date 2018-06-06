import { isUndefined, isString, isEmptyObject, isObject } from "./utils";
var RequestCriteria = (function () {
    function RequestCriteria() {
        this.criteria = {};
        this.orCriteria = {};
    }
    RequestCriteria.prototype.or = function () {
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
    RequestCriteria.prototype.whereNotEqualTo = function (key, value) {
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
    RequestCriteria.prototype.whereLike = function (key, value) {
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
    RequestCriteria.prototype.whereEqualTo = function (key, value) {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = value;
            return this;
        }
        throw new Error("DuplicateError: contains clause has already been used in this query");
    };
    RequestCriteria.prototype.whereContains = function (key, value) {
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
    RequestCriteria.prototype.whereIn = function (key) {
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = value;
            return this;
        }
        throw new Error("DuplicateError: contains clause has already been used in this query");
    };
    RequestCriteria.prototype.whereStartsWith = function (key, value) {
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
    RequestCriteria.prototype.whereEndsWith = function (key, value) {
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
    RequestCriteria.prototype.whereNotIn = function (key, value) {
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
    RequestCriteria.prototype.whereLessThan = function (key, value) {
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
    RequestCriteria.prototype.whereLessThanOrEqualTo = function (key, value) {
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
    RequestCriteria.prototype.whereGreaterThan = function (key, value) {
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
    RequestCriteria.prototype.whereGreaterThanOrEqualTo = function (key, value) {
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
    RequestCriteria.prototype.build = function () {
        if (isEmptyObject(this.criteria)) {
            return "";
        }
        var stringify = function (criteria) { return JSON.stringify(criteria); };
        if (!isEmptyObject(this.orCriteria)) {
            if (Array.isArray(this.orCriteria["or"])) {
                this.orCriteria["or"].push(this.criteria);
            }
            return stringify(this.orCriteria);
        }
        return stringify(this.criteria);
    };
    RequestCriteria.prototype.toString = function () {
        return this.build();
    };
    return RequestCriteria;
}());
export { RequestCriteria };
//# sourceMappingURL=sails.request.criteria.js.map