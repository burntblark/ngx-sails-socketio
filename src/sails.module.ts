import { NgModule, ModuleWithProviders } from "@angular/core";
import { Sails, SAILS_OPTIONS, SAILS_INTERCEPTORS } from "./sails";
import { SailsOptions } from "./sails.options";
import { CanIntercept } from "./sails.interceptor.interface";

@NgModule()
export class SailsModule {
    static forRoot(options: SailsOptions, interceptors: CanIntercept[] = []): ModuleWithProviders {
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
