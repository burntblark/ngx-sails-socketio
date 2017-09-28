var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { SailsModel } from "./sails.model";
import { SailsRequest } from "./sails.request";
import { RequestCriteria } from "./sails.request.criteria";
var SailsQuery = /** @class */ (function (_super) {
    __extends(SailsQuery, _super);
    function SailsQuery(sails, modelClass) {
        var _this = _super.call(this, sails) || this;
        _this.modelClass = modelClass;
        _this.errorMsg = "[SailsSocketIO]: the data is not an instance of " + _this.modelClass.name + ".\n        You could SailsModel.unserialize(" + _this.modelClass.name + ", data) as " + _this.modelClass.name + "[] (Array of Models), Or\n        SailsModel.unserialize(" + _this.modelClass.name + ", data) as " + _this.modelClass.name + " (Single Models)\n        after fetching the data with SailsRequest.";
        _this.model = new modelClass();
        return _this;
    }
    SailsQuery.prototype.find = function () {
        var _this = this;
        this.addParam("where", this.getRequestCriteria());
        return this.get("/" + this.model.getEndPoint()).then(function (res) {
            if (res.isOk()) {
                return SailsModel.unserialize(_this.modelClass, res.getData());
            }
            throw res;
        });
    };
    SailsQuery.prototype.findById = function (id) {
        var _this = this;
        this.addParam("where", this.getRequestCriteria());
        return this.get("/" + this.model.getEndPoint() + "/" + id).then(function (res) {
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
            return this.post(url, data).then(function (res) {
                if (res.isCreated()) {
                    return SailsModel.unserialize(_this.modelClass, res.getData());
                }
                throw res;
            });
        }
        else {
            return this.put(url.concat("/", model.id), data).then(function (res) {
                if (res.isCreated()) {
                    return SailsModel.unserialize(_this.modelClass, res.getData());
                }
                throw res;
            });
        }
    };
    SailsQuery.prototype.update = function (model) {
        var _this = this;
        if (!(model instanceof this.modelClass)) {
            throw new TypeError(this.errorMsg);
        }
        delete model.createdAt;
        delete model.updatedAt;
        var data = SailsModel.serialize(model);
        return this.put("/" + model.getEndPoint() + "/" + model.id, data).then(function (res) {
            if (res.isOk()) {
                return SailsModel.unserialize(_this.modelClass, res.getData());
            }
            throw res;
        });
    };
    SailsQuery.prototype.remove = function (model) {
        var _this = this;
        if (!(model instanceof this.modelClass)) {
            throw new TypeError(this.errorMsg);
        }
        return this.delete("/" + model.getEndPoint() + "/" + model.id).then(function (res) {
            if (res.isOk()) {
                return SailsModel.unserialize(_this.modelClass, res.getData());
            }
            throw res;
        });
    };
    SailsQuery.prototype.setLimit = function (limit) {
        this.addParam("limit", limit);
        return this;
    };
    SailsQuery.prototype.setSort = function (sort) {
        this.addParam("sort", sort);
        return this;
    };
    SailsQuery.prototype.setSkip = function (skip) {
        this.addParam("skip", skip);
        return this;
    };
    SailsQuery.prototype.setPopulation = function () {
        var population = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            population[_i] = arguments[_i];
        }
        this.addParam("populate", "[" + population.join(",") + "]");
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
}(SailsRequest));
export { SailsQuery };
