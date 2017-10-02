import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Sails } from "ngx-sails-socketio";
import { JobsService } from "../../services/jobs.service";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"]
})

export class DashboardComponent implements OnInit {

    constructor(private router: Router, private sails: Sails, private jobs: JobsService) { }

    ngOnInit() {        // this.jobs.getJobs()
        this.jobs.getQueried()
            .catch(e => {
                console.log(e);
                return [];
            })
            .then(data => {
                console.log(data);

                const model = data[0];
                if (model) {
                    // this.jobs.updateJob(model).catch(e => console.log(e));
                    this.jobs.saveBoq(model).catch(e => console.log(e));
                }
            });
    }

    onLogout(e: Event) {
        e.preventDefault();

        setTimeout(() => {
            localStorage.clear();
            this.router.navigateByUrl("/login");
        }, 1000);
    }

}
