import { NgModule, ModuleWithProviders } from "@angular/core";
import { Sails, SAILS_OPTIONS, SAILS_INTERCEPTORS } from "./sails";
import { SailsOptions } from "./sails.options";
import { SailsInterceptorConstructor } from "./sails.interceptor";

@NgModule()
export class SailsModule {
    static forRoot(options: SailsOptions, interceptors: SailsInterceptorConstructor[] = []): ModuleWithProviders {
        return {
            ngModule: SailsModule,
            providers: [
                Sails,
                ...interceptors,
                { provide: SAILS_OPTIONS, useValue: options },
                { provide: SAILS_INTERCEPTORS, useValue: interceptors },
            ]
        };
    }
}
