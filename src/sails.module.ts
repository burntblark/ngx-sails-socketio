import { NgModule, ModuleWithProviders } from "@angular/core";
import { Sails, SAILS_OPTIONS } from "./sails";
import { SailsOptions } from "./sails.options";

@NgModule({})
export class SailsModule {
    static forRoot(url: string, options: SailsOptions): ModuleWithProviders {

        return {
            ngModule: SailsModule,
            providers: [
                Sails,
                {
                    provide: SAILS_OPTIONS,
                    useValue: Object.assign({}, options, { url })
                },
            ]
        }
    }
}
