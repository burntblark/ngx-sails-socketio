import { NgModule } from "@angular/core";
import { Sails, SAILS_OPTIONS, SAILS_INTERCEPTORS } from "./sails";
var SailsModule = (function () {
    function SailsModule() {
    }
    SailsModule.forRoot = function (options, interceptors) {
        if (interceptors === void 0) { interceptors = []; }
        return {
            ngModule: SailsModule,
            providers: [
                Sails
            ].concat(interceptors, [
                { provide: SAILS_OPTIONS, useValue: options },
                { provide: SAILS_INTERCEPTORS, useValue: interceptors },
            ])
        };
    };
    return SailsModule;
}());
export { SailsModule };
SailsModule.decorators = [
    { type: NgModule },
];
/** @nocollapse */
SailsModule.ctorParameters = function () { return []; };
//# sourceMappingURL=sails.module.js.map