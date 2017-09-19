"use strict";
exports.__esModule = true;
// export class SailsModel implements SailsModelInterface<SailsModel> {
var SailsModel = /** @class */ (function () {
    function SailsModel(sails) {
        this.sails = sails;
    }
    SailsModel.prototype.getEndPoint = function () {
        return "endpoint";
    };
    return SailsModel;
}());
exports.SailsModel = SailsModel;
