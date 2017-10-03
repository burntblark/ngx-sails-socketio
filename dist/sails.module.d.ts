import { ModuleWithProviders } from "@angular/core";
import { SailsOptions } from "./sails.options";
import { SailsInterceptorConstructor } from "./sails.interceptor";
export declare class SailsModule {
    static forRoot(options: SailsOptions, interceptors?: SailsInterceptorConstructor[]): ModuleWithProviders;
}
