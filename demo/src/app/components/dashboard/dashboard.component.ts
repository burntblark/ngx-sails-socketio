import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Sails } from "ngx-sails-socketio";
import { JobsService } from "../../services/jobs.service";
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BoqModel } from "../../models/boq.model";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"]
})

export class DashboardComponent implements OnInit {
    boqs$;

    constructor(private router: Router, private sails: Sails, private jobs: JobsService) { }

    ngOnInit() {
        this.boqs$ = merge(
            this.jobs.listenAll().pipe(tap(() => console.log("Second"))),
            this.jobs.getQueried().pipe(tap(() => console.log("First")))
        );
    }

    onLogout(e: Event) {
        e.preventDefault();

        setTimeout(() => {
            localStorage.clear();
            this.router.navigateByUrl("/login");
        }, 1000);
    }

}
