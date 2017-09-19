var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from "@angular/core";
import { Sails } from "./sails";
import { SailsOptions } from "./sails.options";
import { SailsQueryFactory } from "./sails.query.factory";
var SailsModule = /** @class */ (function () {
    function SailsModule() {
    }
    SailsModule_1 = SailsModule;
    SailsModule.forRoot = function () {
        return {
            ngModule: SailsModule_1,
            providers: [Sails, SailsQueryFactory, SailsOptions]
        };
    };
    SailsModule = SailsModule_1 = __decorate([
        NgModule({})
    ], SailsModule);
    return SailsModule;
    var SailsModule_1;
}());
export { SailsModule };
//# sourceMappingURL=/Users/apple/Desktop/ANGULAR/ngx-sails-socketio/src/sails.module.js.map