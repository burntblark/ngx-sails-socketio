import { SailsResponse } from "./sails.response";
import { Router } from "@angular/router";

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
