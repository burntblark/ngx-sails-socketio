import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Sails } from "ngx-sails-socketio";
import { JobsService } from "../../services/jobs.service";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/do";
import { Observable } from "rxjs/Observable";
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
        this.boqs$ = Observable.merge(
            this.jobs.listenAll().do(() => console.log("Second")),
            this.jobs.getQueried().do(() => console.log("First")),
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
