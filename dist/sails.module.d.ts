import { ModuleWithProviders } from "@angular/core";
import { SailsInterceptorConstructor } from "./sails.interceptor";
import { SailsOptions } from "./sails.options";
export declare class SailsModule {
    static forRoot(options: SailsOptions, interceptors?: SailsInterceptorConstructor[]): ModuleWithProviders;
}
