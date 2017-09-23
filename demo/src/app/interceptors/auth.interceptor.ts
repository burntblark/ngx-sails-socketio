import { SailsResponse, SailsInterceptorInterface } from "ngx-sails-socketio";
import { Router } from "@angular/router";

export class AuthInterceptor implements SailsInterceptorInterface {

    canIntercept(response: SailsResponse): boolean {
        console.log(response);
        return true;
    }
}
