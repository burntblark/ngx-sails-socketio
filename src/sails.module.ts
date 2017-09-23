import { NgModule, ModuleWithProviders } from "@angular/core";
import { Sails, SAILS_OPTIONS, SAILS_INTERCEPTORS } from "./sails";
import { SailsOptions } from "./sails.options";
import { SailsInterceptorInterface } from "./sails.interceptor.interface";

@NgModule()
export class SailsModule {
    static forRoot(options: SailsOptions, interceptors: ({ new(): SailsInterceptorInterface })[] = []): ModuleWithProviders {
        return {
            ngModule: SailsModule,
            providers: [
                {
                    provide: SAILS_INTERCEPTORS,
                    useValue: interceptors
                },
                {
                    provide: SAILS_OPTIONS,
                    useValue: options
                },
                Sails
            ]
        };
    }
}
