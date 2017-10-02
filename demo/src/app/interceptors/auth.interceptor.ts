import { SailsRequestOptions, SailsResponse, SailsInterceptorInterface, SailsInterceptorHandlerInterface } from "ngx-sails-socketio";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { JobsService } from "../services/jobs.service";

@Injectable()
export class AuthInterceptor implements SailsInterceptorInterface {

    constructor(private router: Router, private jobs: JobsService) {
    }

    intercept(request: SailsRequestOptions, next: SailsInterceptorHandlerInterface): Promise<SailsResponse> {
        request.clone({
            headers: request.headers.set("Authorization", localStorage.getItem("token"))
        });
        const response = next.handle(request);

        console.log("Auth: ", request);

        return response.then(res => {
            if (res.getStatusCode() === 401) {
                this.router.navigateByUrl("login");
            }
            return res;
        });
    }
}
