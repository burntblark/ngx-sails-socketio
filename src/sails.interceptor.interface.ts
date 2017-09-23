import { SailsResponse } from "./sails.response";

export interface SailsInterceptorConstructor {
    /**
     * Allows Angular Dependency Injection
     */
    new(...args: any[]): any;
}

export interface SailsInterceptorInterface {
    /**
     * @returns boolean True if was intercepted else False
     */
    canIntercept: (response: SailsResponse) => boolean;
}
