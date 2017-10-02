import { Component, OnInit } from "@angular/core";
import { Sails, SailsListener } from "ngx-sails-socketio";
import { JobsService } from "./services/jobs.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

    constructor(private sails: Sails, private jobs: JobsService) {
        sails.addEventListener(SailsListener.CONNECTING, data => {
            console.log("CONNECTING...");
            console.dir(data);
        });

        sails.addEventListener(SailsListener.RECONNECTING, data => {
            console.log("RECONNECTING...");
            console.dir(data);
        });

        sails.addEventListener(SailsListener.RECONNECT, data => {
            console.log("RECONNECT...");
            console.dir(data);
        });

        sails.addEventListener(SailsListener.DISCONNECT, data => {
            console.log("DISCONNECT...");
            console.dir(data);
        });

        sails.addEventListener(SailsListener.CONNECT, data => {
            console.log("🎉🎉🎉 IT WORKS!!! 🎉🎉🎉");
            console.log("CONNECTED!!!");
            console.dir(data);
        });

        sails.connect();
    }

    ngOnInit() {
        // this.jobs.getJobs()
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
}
