import { SailsResponse, SailsInterceptorInterface } from "ngx-sails-socketio";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { JobsService } from "../services/jobs.service";

@Injectable()
export class AuthInterceptor implements SailsInterceptorInterface {

    constructor(private router: Router, private jobs: JobsService) {
    }

    canIntercept(response: SailsResponse): boolean {
        console.log("Auth: ", response);
        if (response.getStatusCode() === 401) {
            this.router.navigateByUrl("login");
        }
        // Try playing with the return value
        return false;
    }
}
