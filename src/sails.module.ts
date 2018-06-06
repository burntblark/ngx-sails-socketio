import { ModuleWithProviders, NgModule } from "@angular/core";
import { SAILS_INTERCEPTORS, SAILS_OPTIONS, Sails } from "./sails";
import { SailsInterceptorConstructor } from "./sails.interceptor";
import { SailsOptions } from "./sails.options";

@NgModule()
export class SailsModule {
  static forRoot(
    options: SailsOptions,
    interceptors: SailsInterceptorConstructor[] = []
  ): ModuleWithProviders {
    return {
      ngModule: SailsModule,
      providers: [
        Sails,
        ...interceptors,
        { provide: SAILS_OPTIONS, useValue: options },
        { provide: SAILS_INTERCEPTORS, useValue: interceptors }
      ]
    };
  }
}
