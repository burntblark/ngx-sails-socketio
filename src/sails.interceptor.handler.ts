import { SailsResponse } from "./sails.response";
import { SailsRequestOptions } from "./sails.request.options";
import { SailsInterceptorInterface } from "./sails.interceptor";
import { Observable } from "rxjs";

export interface SailsInterceptorHandlerInterface {
    handle(request: SailsRequestOptions): Observable<SailsResponse>;
}

export class SailsInterceptorHandler implements SailsInterceptorHandlerInterface {
    constructor(private next: SailsInterceptorHandlerInterface, private interceptor: SailsInterceptorInterface) { }

    handle(request: SailsRequestOptions): Observable<SailsResponse> {
        return this.interceptor.intercept(request, this.next);
    }
}
