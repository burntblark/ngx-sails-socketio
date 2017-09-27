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

    constructor(sails: Sails, private jobs: JobsService) {
        sails.addEventListener(SailsListener.CONNECTING, data => {
            console.log("CONNECTING...");
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
        this.jobs.getQueried()
            .catch(e => {
                console.log(e);
                return [];
            })
            .then(data => {
                console.log(data);

                // const model = data[0];
                // this.jobs.save(model).catch(e => console.log(e));
            });
    }
}
