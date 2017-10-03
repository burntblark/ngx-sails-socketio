import { SailsResponse } from "./sails.response";
import { SailsRequestOptions } from "./sails.request.options";
import { SailsInterceptorHandlerInterface } from "./sails.interceptor.handler";
export interface SailsInterceptorConstructor {
    /**
     * Allows Angular Dependency Injection
     */
    new (...args: any[]): any;
}
export interface SailsInterceptorInterface {
    /**
     * @returns Promise<SailsResponse>
     */
    intercept(request: SailsRequestOptions, next: SailsInterceptorHandlerInterface): Promise<SailsResponse>;
}
