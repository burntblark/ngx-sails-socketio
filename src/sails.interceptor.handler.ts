import { SailsResponse } from "./sails.response";
import { SailsRequestOptions } from "./sails.request.options";
import { SailsInterceptorInterface } from "./sails.interceptor";

export interface SailsInterceptorHandlerInterface {
    handle(request: SailsRequestOptions): Promise<SailsResponse>;
}

export class SailsInterceptorHandler implements SailsInterceptorHandlerInterface {
    constructor(private next: SailsInterceptorHandlerInterface, private interceptor: SailsInterceptorInterface) { }

    handle(request: SailsRequestOptions): Promise<SailsResponse> {
        return this.interceptor.intercept(request, this.next);
    }
}
