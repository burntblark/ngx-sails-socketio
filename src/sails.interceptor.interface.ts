import { SailsResponse } from "./sails.response";

export interface SailsInterceptorInterface {
    /**
     * @returns boolean True if was intercepted else False
     */
    canIntercept: (response: SailsResponse) => boolean;
}
