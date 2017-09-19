"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var sails_1 = require("./sails");
var sails_options_1 = require("./sails.options");
var sails_query_factory_1 = require("./sails.query.factory");
var SailsModule = /** @class */ (function () {
    function SailsModule() {
    }
    SailsModule_1 = SailsModule;
    SailsModule.forRoot = function () {
        return {
            ngModule: SailsModule_1,
            providers: [sails_1.Sails, sails_query_factory_1.SailsQueryFactory, sails_options_1.SailsOptions]
        };
    };
    SailsModule = SailsModule_1 = __decorate([
        core_1.NgModule({})
    ], SailsModule);
    return SailsModule;
    var SailsModule_1;
}());
exports.SailsModule = SailsModule;
