import { SailsResponse, SailsInterceptorInterface } from "ngx-sails-socketio";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable()
export class ExtraInterceptor implements SailsInterceptorInterface {

    constructor(private router: Router) {
    }

    canIntercept(response: SailsResponse): boolean {
        console.log("Extra: ", response);
        return false;
    }
}
