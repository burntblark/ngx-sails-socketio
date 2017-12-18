import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Sails } from "ngx-sails-socketio";
import { JobsService } from "../../services/jobs.service";
import "rxjs/add/operator/catch";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"]
})

export class DashboardComponent implements OnInit {

    constructor(private router: Router, private sails: Sails, private jobs: JobsService) { }

    ngOnInit() {
        // this.jobs.getJobs()
        this.jobs.getQueried()
            // this.jobs.getJobs()
            // this.jobs.getBoqs()
            .catch(e => {
                console.log(e);
                return [];
            })
            .subscribe(data => {
                console.log(data);

                // const model = data[0];
                // if (model) {
                //     // this.jobs.updateJob(model).catch(e => console.log(e));
                //     this.jobs.saveBoq(model).catch(e => console.log(e));
                // }
            });

        // Pub-Sub
        this.jobs.listenOne().subscribe(info => console.log(info));
        this.jobs.listenAll().subscribe(info => console.log(info));
        // this.jobs.listen();
    }

    onLogout(e: Event) {
        e.preventDefault();

        setTimeout(() => {
            localStorage.clear();
            this.router.navigateByUrl("/login");
        }, 1000);
    }

}
