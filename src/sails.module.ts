import { NgModule, ModuleWithProviders } from "@angular/core";
import { Sails, SAILS_OPTIONS } from "./sails";
import { SailsOptions } from "./sails.options";

@NgModule({})
export class SailsModule {
    static forRoot(options: SailsOptions): ModuleWithProviders {
        return {
            ngModule: SailsModule,
            providers: [
                {
                    provide: SAILS_OPTIONS,
                    useValue: options
                },
                // Sails,
                {
                    provide: Sails,
                    useClass: Sails,
                    deps: [SAILS_OPTIONS]
                },
            ]
        };
    }
}
