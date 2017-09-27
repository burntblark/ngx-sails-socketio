var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Property, serialize, unserialize } from "./sails.serialize";
import { Endpoint } from "./sails.decorator.endpoint";
import { isObject } from "./utils";
var SailsModel = /** @class */ (function () {
    function SailsModel() {
        this.id = null;
        this.createdAt = null;
        this.updatedAt = null;
    }
    SailsModel.prototype.getEndPoint = function () {
        return this.getEndPoint();
    };
    SailsModel.unserialize = function (model) {
        return unserialize(model);
    };
    SailsModel.serialize = function (modelClazz, data) {
        var callFn = function (model) { return serialize(modelClazz, model); };
        if (Array.isArray(data)) {
            return data.map(callFn);
        }
        else if (isObject(data)) {
            return callFn(data);
        }
        throw new Error("SailsModel.serialize requires a data parameter of either a Literal Object or an Array of Literal Objects");
    };
    __decorate([
        Property(),
        __metadata("design:type", String)
    ], SailsModel.prototype, "id", void 0);
    __decorate([
        Property({ type: Date }),
        __metadata("design:type", Date)
    ], SailsModel.prototype, "createdAt", void 0);
    __decorate([
        Property({ type: Date }),
        __metadata("design:type", Date)
    ], SailsModel.prototype, "updatedAt", void 0);
    SailsModel = __decorate([
        Endpoint()
    ], SailsModel);
    return SailsModel;
}());
export { SailsModel };
