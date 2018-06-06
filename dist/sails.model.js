var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Property, unserialize } from "./sails.serialize";
import { Endpoint } from "./sails.decorator.endpoint";
import { isObject } from "./utils";
var SailsModel = SailsModel_1 = (function () {
    function SailsModel() {
        this.id = "";
    }
    SailsModel.prototype.getEndPoint = function () {
        return this.getEndPoint();
    };
    SailsModel.serialize = function (model) {
        var recr = function (obj) {
            for (var key in obj) {
                var prop = obj[key];
                // Ignore NULL values
                if (prop === null || typeof prop === "function") {
                    delete obj[key];
                }
                // Convert Property Models to their ID representations
                if (prop && prop instanceof SailsModel_1 && prop.id !== null) {
                    obj[key] = prop.id;
                }
                if (prop && prop instanceof SailsModel_1) {
                    obj[key] = SailsModel_1.serialize(prop);
                }
                if (prop && prop instanceof Array) {
                    obj[key] = prop.map(function (ob) {
                        if (ob instanceof SailsModel_1) {
                            return SailsModel_1.serialize(ob);
                        }
                        return ob;
                    });
                }
            }
            return obj;
        };
        return recr(Object.assign({}, model));
    };
    SailsModel.unserialize = function (modelClazz, data) {
        var callFn = function (model) { return unserialize(modelClazz, model); };
        if (Array.isArray(data)) {
            return data.map(callFn);
        }
        else if (isObject(data)) {
            return callFn(data);
        }
        throw new Error("SailsModel.unserialize requires a data parameter of either a Literal Object or an Array of Literal Objects");
    };
    return SailsModel;
}());
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
SailsModel = SailsModel_1 = __decorate([
    Endpoint()
], SailsModel);
export { SailsModel };
var SailsModel_1;
//# sourceMappingURL=sails.model.js.map