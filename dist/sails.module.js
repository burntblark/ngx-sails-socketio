import { NgModule } from "@angular/core";
import { SAILS_INTERCEPTORS, SAILS_OPTIONS, Sails } from "./sails";
var SailsModule = /** @class */ (function () {
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
                { provide: SAILS_INTERCEPTORS, useValue: interceptors }
            ])
        };
    };
    SailsModule.decorators = [
        { type: NgModule },
    ];
    return SailsModule;
}());
export { SailsModule };
