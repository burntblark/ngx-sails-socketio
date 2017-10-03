import { SailsResponse } from "./sails.response";
import { SailsRequestOptions } from "./sails.request.options";
import { SailsInterceptorInterface } from "./sails.interceptor";
export interface SailsInterceptorHandlerInterface {
    handle(request: SailsRequestOptions): Promise<SailsResponse>;
}
export declare class SailsInterceptorHandler implements SailsInterceptorHandlerInterface {
    private next;
    private interceptor;
    constructor(next: SailsInterceptorHandlerInterface, interceptor: SailsInterceptorInterface);
    handle(request: SailsRequestOptions): Promise<SailsResponse>;
}
