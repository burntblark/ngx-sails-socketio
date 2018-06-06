import { SailsModel } from "./sails.model";
import { SailsRequest } from "./sails.request";
import { RequestCriteria } from "./sails.request.criteria";
import "rxjs/add/operator/map";
var SailsQuery = (function () {
    function SailsQuery(sails, modelClass) {
        this.modelClass = modelClass;
        this.errorMsg = "[SailsSocketIO]: the data is not an instance of " + this.modelClass.name + ".\n        You could SailsModel.unserialize(" + this.modelClass.name + ", data) as " + this.modelClass.name + "[] (Array of Models), Or\n        SailsModel.unserialize(" + this.modelClass.name + ", data) as " + this.modelClass.name + " (Single Models)\n        after fetching the data with SailsRequest.";
        this.request = new SailsRequest(sails);
        this.model = new modelClass();
    }
    SailsQuery.prototype.find = function () {
        var _this = this;
        this.request.addParam("where", this.getRequestCriteria());
        return this.request.get("/" + this.model.getEndPoint()).map(function (res) {
            if (res.isOk()) {
                return SailsModel.unserialize(_this.modelClass, res.getData());
            }
            throw res;
        });
    };
    SailsQuery.prototype.findById = function (id) {
        var _this = this;
        this.request.addParam("where", this.getRequestCriteria());
        return this.request.get("/" + this.model.getEndPoint() + "/" + id).map(function (res) {
            if (res.isOk()) {
                return SailsModel.unserialize(_this.modelClass, res.getData());
            }
            throw res;
        });
    };
    SailsQuery.prototype.save = function (model) {
        var _this = this;
        if (!(model instanceof this.modelClass)) {
            throw new TypeError(this.errorMsg);
        }
        var data = SailsModel.serialize(model);
        var url = "/" + model.getEndPoint();
        if (model.id === null) {
            return this.request.post(url, data).map(function (res) {
                if (res.isOk()) {
                    return SailsModel.unserialize(_this.modelClass, res.getData());
                }
                throw res;
            });
        }
        else {
            return this.request.put(url.concat("/", model.id), data).map(function (res) {
                if (res.isOk()) {
                    return SailsModel.unserialize(_this.modelClass, res.getData());
                }
                throw res;
            });
        }
    };
    SailsQuery.prototype.update = function (id, model) {
        var _this = this;
        if (model.createdAt) {
            delete model.createdAt;
        }
        if (model.updatedAt) {
            delete model.updatedAt;
        }
        var data = model instanceof SailsModel ? SailsModel.serialize(model) : Object.assign({}, model);
        return this.request.put("/" + this.model.getEndPoint() + "/" + id, data).map(function (res) {
            if (res.isOk()) {
                return SailsModel.unserialize(_this.modelClass, res.getData());
            }
            throw res;
        });
    };
    SailsQuery.prototype.remove = function (id) {
        var _this = this;
        return this.request.delete("/" + this.model.getEndPoint() + "/" + id).map(function (res) {
            if (res.isOk()) {
                return SailsModel.unserialize(_this.modelClass, res.getData());
            }
            throw res;
        });
    };
    SailsQuery.prototype.setLimit = function (limit) {
        this.request.addParam("limit", limit);
        return this;
    };
    SailsQuery.prototype.setSort = function (sort) {
        this.request.addParam("sort", sort);
        return this;
    };
    SailsQuery.prototype.setSkip = function (skip) {
        this.request.addParam("skip", skip);
        return this;
    };
    SailsQuery.prototype.setPopulation = function () {
        var population = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            population[_i] = arguments[_i];
        }
        this.request.addParam("populate", "[" + population.join(",") + "]");
        return this;
    };
    SailsQuery.prototype.setRequestCriteria = function (criteria) {
        this.criteria = criteria;
        return this;
    };
    SailsQuery.prototype.getRequestCriteria = function () {
        return this.criteria || new RequestCriteria();
    };
    return SailsQuery;
}());
export { SailsQuery };
//# sourceMappingURL=sails.query.js.map