
import { NgModule, ModuleWithProviders } from "@angular/core";
import { Sails } from "./sails";
import { SailsOptions } from "./sails.options";
import { SailsQueryFactory } from "./sails.query.factory";

@NgModule({})
export class SailsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SailsModule,
            providers: [Sails, SailsQueryFactory, SailsOptions]
        }
    }
}