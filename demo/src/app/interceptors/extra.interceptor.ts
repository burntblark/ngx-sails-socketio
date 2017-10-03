import { SailsResponse, SailsInterceptorInterface, SailsRequestOptions, SailsInterceptorHandlerInterface } from "ngx-sails-socketio";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable()
export class ExtraInterceptor implements SailsInterceptorInterface {

    constructor(private router: Router) {
    }

    intercept(request: SailsRequestOptions, next: SailsInterceptorHandlerInterface): Promise<SailsResponse> {
        console.log("Extra: ", request);
        request.clone({
            headers: request.headers.set("Content-type", "text/plain")
        });
        return next.handle(request);
    }
}
